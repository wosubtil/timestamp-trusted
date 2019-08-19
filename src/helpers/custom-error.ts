export class CustomError extends Error {
  constructor (message) {
    super(message)
    return {
      message: this.message,
      stack: this.stack
    }
  }
}
