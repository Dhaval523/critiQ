// src/utils/ApiError.js
class ApiError extends Error {
    constructor(
      statusCode,
      message = "Something went wrong",
      errors = [],
      stack = ""
    ) {
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.message = message;
      this.success = false;
      this.errors = errors;
  
      // Capture stack trace (remove if not needed)
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor); // Fix: Use "this.constructor"
      }
    }
  }
  
  export { ApiError };