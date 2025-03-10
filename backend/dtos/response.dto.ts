import FieldErrorsType from "../types/fieldErrors.js";

type overallError = {
  message: string;
} | null;
class ResponseDTO<dataT = null> {
  fieldErrors: FieldErrorsType | null;
  overallError: overallError | null;
  success: boolean;
  successMessage: string | null;
  data: dataT | null;
  public constructor(
    fieldErrors: FieldErrorsType = null,
    overallError: overallError = null,
    success: boolean = false,
    successMessage: string | null = null,
    data: dataT | null = null
  ) {
    this.fieldErrors = fieldErrors;
    this.overallError = overallError;
    this.success = success;
    this.successMessage = successMessage;
    this.data = data;
  }
}
export default ResponseDTO;
