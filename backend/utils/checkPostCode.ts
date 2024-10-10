export const checkPostCode=(postCode)=>{
    var regex = new RegExp("^\\d{10}$");
    var result = regex.test(postCode);
    return result;

} 