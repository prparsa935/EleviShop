export const check_phone = (number) => {
    var regex = new RegExp("^09\\d{9}$");
    var result = regex.test(number);
    return result;
};
