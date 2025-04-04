export class NodeEvaluationError extends Error {
  constructor(message: string, public details?: Record<string, any>) {
    super(message);
    this.name = "NodeEvaluationError";
  }
}
