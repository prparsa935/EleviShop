import { ValidationError } from "class-validator";
import FieldErrorsType from "../types/fieldErrors";

export class OverallError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "overallError";
  }
}

export class FieldErrors extends Error {
  public validationErrors: ValidationError[];

  constructor(validationErrors: ValidationError[]) {
    super();
    this.validationErrors = validationErrors;
  }
}
