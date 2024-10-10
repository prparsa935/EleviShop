type FieldErrors = {
  [key: string]: string; // key is the field name, value is the error message
};
class ResponseDTO<dataT = null> {
  fieldErrors: FieldErrors;
  overallError: string | null;
  success: boolean;
  successMessage: string | null;
  data: dataT | null;
  public constructor(
    fieldErrors: FieldErrors = {},
    overallError: string = null,
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
