type FieldErrors = {
  [key: string]: string; // key is the field name, value is the error message
};
type overallError = {
  message: string;
};
class ResponseDTO<dataT = null> {
  fieldErrors: FieldErrors;
  overallError: overallError | null;
  success: boolean;
  successMessage: string | null;
  data: dataT | null;
  public constructor(
    fieldErrors: FieldErrors = {},
    overallError: overallError = null,
    success: boolean = false,
    successMessage: string = null,
    data: dataT = null
  ) {
    this.fieldErrors = fieldErrors;
    this.overallError = overallError;
    this.success = success;
    this.successMessage = successMessage;
    this.data = data;
  }
}
export default ResponseDTO;
