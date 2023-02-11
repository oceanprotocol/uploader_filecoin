class AppError extends Error {
  constructor(message, statusCode, name = '') {
    super(message);
    this.statusCode = statusCode;
    if (name) {
      this.name = name;
    }
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
