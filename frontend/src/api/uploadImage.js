import axios from "axios";
import { serverAddress } from "../App";

const uploadImage = async (
  e,
  setUploadProgress,
  setUploadedImages,
  setIsUploading
) => {
  try {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await axios.post(
      serverAddress + "image/upload",
      formData,
      {
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
      console.log('im uploaded LOL')
      setUploadedImages((prev) => {
        return [...prev, res.data];
      });
    }
  } catch (error) {
    console.log("hello");
    setIsUploading(false);
    setUploadProgress(0);
  }
};
export { uploadImage };
