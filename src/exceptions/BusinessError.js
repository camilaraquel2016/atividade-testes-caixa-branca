const AppError = require("./AppError");

class BusinessError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = BusinessError;