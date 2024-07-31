const getFieldMessage = (fieldName,errors) => {
  if (errors) {
    console.log(errors);
    console.log(errors.fieldErrors);
    for (const error of errors) {
      console.log(error);
      console.log(error.field);
      if (error.field === fieldName) {
        console.log(error.message);
        return error.message;
      }
    }
   
  }
  return null;
};
export { getFieldMessage };
