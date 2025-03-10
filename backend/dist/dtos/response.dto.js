class ResponseDTO {
    constructor(fieldErrors = null, overallError = null, success = false, successMessage = null, data = null) {
        this.fieldErrors = fieldErrors;
        this.overallError = overallError;
        this.success = success;
        this.successMessage = successMessage;
        this.data = data;
    }
}
export default ResponseDTO;
