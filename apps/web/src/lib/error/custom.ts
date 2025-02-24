export class CustomError extends Error {
  customError = true;
  constructor(message: string) {
    super(message);
  }
}
