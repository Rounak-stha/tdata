export class RetryHandler {
  async executeWithRetry(
    fn: () => Promise<any>,
    options: {
      maxRetries: number;
      delay: number;
      onRetry?: (error: any, retryCount: number) => void;
    }
  ): Promise<any> {
    let iterations = 0;

    while (iterations <= options.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        iterations++;

        if (iterations >= options.maxRetries) {
          throw error;
        }

        if (options.onRetry) {
          options.onRetry(error, iterations);
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, options.delay * Math.pow(2, iterations)));
      }
    }
  }
}
