import { Channel, ConsumeMessage } from "amqplib";
import { RabbitMQConnection } from "../config/rabbitmq";
import { logger } from "../config/logger";
import { RetryHandler } from "../utils/retry";
import { EventType, TaskMessage } from "@tdata/shared/types";
import { ErrorHandler } from "@/utils";
import { AutomationService } from "./automation";
import { getSystemVariables } from "@tdata/shared/utils";
import { AutomationProcessor } from "src/processor";
import { TaskEventBasedFlowContext } from "@/processor/context";
import { FlowVariableManager } from "@/processor/variable";

export class RabbitMQService {
  private channel: Channel;
  private retryHandler: RetryHandler;

  constructor(private connection: RabbitMQConnection) {
    this.retryHandler = new RetryHandler();
    this.channel = connection.getChannel();
  }

  public async init(): Promise<void> {
    // Bind queue to exchange
    await this.channel.bindQueue(this.connection.getQueue(), this.connection.getExchange(), this.connection.getRoutingKey());

    // Consume messages
    await this.channel.consume(this.connection.getQueue(), this.processMessage.bind(this), {
      noAck: false,
    });
  }

  /**
   * 
   * @param msg Example Message: 
   * 	{
			"event": "TASK_UPDATED",
			"payload": { "taskId": 7 },
			"userId": "quety"
		}
   * @returns 
   */
  private async processMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) return;

    try {
      // Parse message with type safety
      const taskMessage: TaskMessage = this.parseMessage(msg);
      await this.processTaskEvent(taskMessage);

      // Acknowledge message
      this.channel.ack(msg);
    } catch (error) {
      ErrorHandler.handle(error, {
        message: msg.content.toString(),
        exchange: this.connection.getExchange(),
        queue: this.connection.getQueue(),
      });

      this.channel.reject(msg, false);
    }
  }

  private parseMessage(msg: ConsumeMessage): TaskMessage {
    try {
      const message = JSON.parse(msg.content.toString());
      this.validateMessage(message);
      return message;
    } catch (error) {
      logger.error("Message parsing failed", {
        content: msg.content.toString(),
        error: error instanceof Error ? error.message : error,
      });
      throw new Error("Invalid message format");
    }
  }

  private validateMessage(message: any): asserts message is TaskMessage {
    // Comprehensive message validation
    if (!message) {
      throw new Error("Empty message");
    }

    const requiredFields: (keyof TaskMessage)[] = ["event", "payload", "userId"];
    for (const field of requiredFields) {
      if (!(field in message)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate event type
    const validEventTypes: EventType[] = ["TASK_CREATED", "TASK_UPDATED"];
    if (!validEventTypes.includes(message.event)) {
      throw new Error(`Invalid event type: ${message.event}`);
    }

    // Validate content
    if (!message.payload.taskId) {
      throw new Error("Invalid task content");
    }

    // Optional: Add timestamp validation
    if (!message.timestamp) {
      message.timestamp = Date.now();
    }
  }

  private async processTaskEvent(message: TaskMessage): Promise<void> {
    logger.info(`Processing ${message.event}`, {
      taskId: message.payload.taskId,
      userId: message.userId,
    });

    const task = await AutomationService.getTaskDetails(message.payload.taskId);
    if (!task) {
      throw new Error(`Task not found: ${message.payload.taskId}`);
    }
    const project = await AutomationService.getProjectById(task.projectId);
    if (!project) {
      throw new Error(`Project not found: ${task.projectId}`);
    }

    const projectTemplate = await AutomationService.getProjectTemplate(project.id);

    if (!projectTemplate) {
      throw new Error(`Project template not found: ${project.id}`);
    }

    const automations = await AutomationService.getProjectAutomations(task.projectId);

    // Filter and process relevant automations
    const relevantAutomations = automations.filter((automation) => automation.triggerType === message.event);
    const variables = getSystemVariables({ ...project, template: projectTemplate }, task);

    // Process each relevant automation
    for (const automation of relevantAutomations) {
      const context = new TaskEventBasedFlowContext({
        automation: automation,
        message: message,
        variableManager: new FlowVariableManager(variables.concat(automation.variables || [])),
        project: { ...project, template: projectTemplate },
        task: task,
      });

      const automationProcessor = new AutomationProcessor(context);

      await this.retryHandler.executeWithRetry(() => automationProcessor.processFlow(), {
        maxRetries: 0, // we do not want to retry any automations right now as there are many things to consider like roling back the already executed nodes.
        delay: 1000,
        onRetry: (error, retryCount) => {
          logger.warn(`Automation processing retry ${retryCount}`, {
            automationId: automation.id,
            error,
          });
        },
      });
    }
  }

  // Utility method to generate a unique trace ID
  private generateTraceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
