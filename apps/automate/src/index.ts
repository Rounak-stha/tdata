import "dotenv/config";

import { RabbitMQConnection } from "./config/rabbitmq";
import { RabbitMQService } from "./services/rabbitmq";
import { logger } from "./config/logger";
import { startWebServer } from "./services/http";

async function bootstrap() {
  try {
    // Establish RabbitMQ Connection
    const connection = RabbitMQConnection.getInstance();
    await connection.connect();

    // Initialize RabbitMQ Service
    const rabbitMQService = new RabbitMQService(connection);

    await rabbitMQService.init();

    logger.info("Flow Processing Service Started");
  } catch (error) {
    logger.error("Service initialization failed", error);
    process.exit(1);
  }
}

bootstrap();
startWebServer();
