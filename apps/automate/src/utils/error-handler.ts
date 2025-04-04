import { logger } from "../config/logger";

export class ErrorHandler {
  static handle(error: any, context?: any): void {
    // Log the error with context
    logger.error("Error processing flow", {
      error: error.message,
      stack: error.stack,
      context,
    });

    // Potentially send error to monitoring service
    // This could integrate with services like Sentry, Datadog, etc.
    // this.sendToMonitoringService(error, context);
  }

  // Optional method to send errors to monitoring service
  // private static sendToMonitoringService(error: any, context: any) { ... }
}
