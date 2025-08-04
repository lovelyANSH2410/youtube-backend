class ApiError extends Error {
    constructor(message, statusCode, errors, stack = "", cause = undefined) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.errors = errors;
        this.cause = cause;
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }

    }
}

export default ApiError;