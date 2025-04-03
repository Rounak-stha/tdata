import { EventType } from "@tdata/shared/types";
import amqplib, { Channel } from "amqplib";
import type { ChannelModel } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const RABBITMQ_AUTOMATE_EXCHANGE_NAME = process.env.RABBITMQ_AUTOMATE_EXCHANGE_NAME;
const RABBITMQ_AUTOMATE_ROUTING_KEY = process.env.RABBITMQ_AUTOMATE_ROUTING_KEY;

if (!RABBITMQ_URL || !RABBITMQ_AUTOMATE_EXCHANGE_NAME || !RABBITMQ_AUTOMATE_ROUTING_KEY) {
  throw new Error("RabbitMQ Env is required");
}
let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const createRabbitMQConnection = async () => {
  if (!RABBITMQ_URL) throw new Error("RABBITMQ_URL is not set");

  if (connection) return connection;

  connection = await amqplib.connect(RABBITMQ_URL);

  connection.on("close", () => {
    console.error("RabbitMQ connection closed.");
    connection = null;
  });

  connection.on("error", (err) => {
    console.error("RabbitMQ connection error:", err);
    connection = null;
  });

  console.log("RabbitMQ connected.");
  return connection;
};

const getRabbitMQChannel = async () => {
  if (channel) return channel;

  const conn = await createRabbitMQConnection();
  channel = await conn.createChannel();

  channel.on("close", () => {
    console.error("RabbitMQ channel closed.");
    channel = null;
  });

  channel.on("error", (err) => {
    console.error("RabbitMQ channel error:", err);
    channel = null;
  });

  await channel.assertExchange(RABBITMQ_AUTOMATE_EXCHANGE_NAME, "direct", { durable: true });
  return channel;
};

/**
 * Publishes a message to the predefined exchange and routing key.
 * @param message The message payload as an object.
 */
export const publishMessage = async (message: object) => {
  try {
    const channel = await getRabbitMQChannel();
    channel.publish(RABBITMQ_AUTOMATE_EXCHANGE_NAME, RABBITMQ_AUTOMATE_ROUTING_KEY, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    return true;
  } catch (error) {
    console.error("Failed to publish message:", error);
    return false;
  }
};

export const createTaskEventMessage = (event: EventType, taskId: number, userId: string) => {
  return {
    event,
    payload: {
      taskId,
    },
    userId,
  };
};
