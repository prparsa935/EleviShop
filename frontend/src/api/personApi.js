import Axios from "axios";
Axios.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`;
const getPerson = async (access) => {
  try {
    const response = await Axios.post(serverAddress + "auth/login", {
      username: username,
      password: password,
    });

    if (response.status === 200) {
      if (response.data.success === true) {
        const access = response.data.jwt;
        userSetter(access);
      }
    }
  } catch (error) {
    if (error.response) {
      setErrors((prev) => {
        return {
          status: "fieldErrors",
          fieldErrors: [error.response.data.fieldErrors],
        };
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      setErrors((prev) => {
        return {
          status: "connectionError",
          message: "در ارتباط با سرور مشکلی پیش امده",
          fieldErrors: [],
        };
      });
    }
  }

  // const response=await fetch('http://localhost:8000/userapi/login',{
  //     headers:{"content-type":"application/json"},
  //     method:"POST",
  //     body:JSON.stringify({"username":username,"password":password})
  // })
};
