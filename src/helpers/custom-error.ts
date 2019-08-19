export class CustomError extends Error {
  constructor (message) {
    super(message)
    return {
      name: 'CustomError',
      message: this.message,
      stack: this.stack
    }
  }
}
