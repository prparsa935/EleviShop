const getFieldMessage = (fieldName, errors) => {
  if (errors) {
    for (const error of errors) {
      if (error.field === fieldName) {
        return error.message;
      }
    }
  }
  return null;
};
export { getFieldMessage };
