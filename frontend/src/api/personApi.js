import Axios from "axios";
import { serverAddress } from "../App";

const getPerson = async (access, setPerson, setErrors,setToastList) => {
  try {
    const response = await Axios.get(serverAddress + "person", {
      headers: { Authorization: `Bearer ${access}` },
    });

    if (response.status === 200) {
      const person = await response.data;
      setPerson(person);
      
    }
  } catch (error) {
    if (error.response) {
      setErrors(() => {
        return {
          status: "fieldErrors",
          fieldErrors: [error.response.data.fieldErrors],
        };
      });
    } else {
        console.log(error)
      // Something happened in setting up the request that triggered an Error
      setToastList((prev) => {
        return [...prev,{
          type: "danger",
          message: "در ارتباط با سرور مشکلی پیش امده",
    
        }];
      });
    }
  }

  // const response=await fetch('http://localhost:8000/userapi/login',{
  //     headers:{"content-type":"application/json"},
  //     method:"POST",
  //     body:JSON.stringify({"username":username,"password":password})
  // })
};
export { getPerson };
