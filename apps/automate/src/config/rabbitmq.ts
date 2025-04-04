import * as amqp from "amqplib";

export interface RabbitMQConfig {
  connectionUrl: string;
  exchange: string;
  queue: string;
  routingKey: string;
}

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const RABBITMQ_AUTOMATE_EXCHANGE_NAME = process.env.RABBITMQ_AUTOMATE_EXCHANGE_NAME;
const RABBITMQ_AUTOMATE_QUEUE_NAME = process.env.RABBITMQ_AUTOMATE_QUEUE_NAME;
const RABBITMQ_AUTOMATE_ROUTING_KEY = process.env.RABBITMQ_AUTOMATE_ROUTING_KEY;

if (!RABBITMQ_URL || !RABBITMQ_AUTOMATE_EXCHANGE_NAME || !RABBITMQ_AUTOMATE_QUEUE_NAME || !RABBITMQ_AUTOMATE_ROUTING_KEY) {
  throw new Error("RabbitMQ Env is required");
}

const Config: RabbitMQConfig = {
  connectionUrl: RABBITMQ_URL,
  exchange: RABBITMQ_AUTOMATE_EXCHANGE_NAME,
  queue: RABBITMQ_AUTOMATE_QUEUE_NAME,
  routingKey: RABBITMQ_AUTOMATE_ROUTING_KEY,
};

export class RabbitMQConnection {
  private static instance: RabbitMQConnection;
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;

  private constructor(private config: RabbitMQConfig) {}

  public static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection(Config);
    }
    return RabbitMQConnection.instance;
  }

  public getExchange(): string {
    return this.config.exchange;
  }

  public getQueue(): string {
    return this.config.queue;
  }

  public getRoutingKey(): string {
    return this.config.routingKey;
  }

  public async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.connectionUrl);
      this.channel = await this.connection.createChannel();

      // Ensure exchange and queue exist
      await this.channel.assertExchange(this.config.exchange, "direct", { durable: true });
      await this.channel.assertQueue(this.config.queue, { durable: true });
    } catch (error) {
      console.error("RabbitMQ connection error:", error);
      throw error;
    }
  }

  public getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized");
    }
    return this.channel;
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
