/**
 * This make a simple error of Express that can be reused
 */

class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;

    }
}

module.exports = ExpressError;