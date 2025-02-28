import axios from "axios";
import { serverAddress } from "../App";

const uploadImage = async (
  e,
  setUploadProgress,
  setUploadedImages,
  setIsUploading,
  setErrors,
  setToastList
) => {
  try {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await axios.post(
      serverAddress + "image/upload",

      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      }
    );
    setUploadProgress(0);
    setIsUploading(false);
    if (res.status === 200) {
      setToastList((prev) => {
    
        return [
          ...prev,
          {
            type: "success",
            message: res.data?.successMessage,
          },
        ];
      });

      setUploadedImages((prev) => {
        return [...prev, res.data.data.image];
      });
    }
  } catch (error) {
    

    setIsUploading(false);
    setUploadProgress(0);
    if (error.response) {
      setErrors(() => {
        return error.response.data.fieldErrors;
      });

      setToastList((prev) => {
   
        return [
          ...prev,
          {
            type: "danger",
            message: error.response.data?.overallError?.message,
          },
        ];
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      setToastList((prev) => {
        return [
          {
            type: "danger",
            message: "در ارتباط با سرور مشکلی پیش امده",
          },
        ];
      });
    }
  }
};
export { uploadImage };
