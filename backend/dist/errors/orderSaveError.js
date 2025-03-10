export class OverallError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = "overallError";
    }
}
export class FieldErrors extends Error {
    constructor(validationErrors) {
        super();
        this.validationErrors = validationErrors;
    }
}
