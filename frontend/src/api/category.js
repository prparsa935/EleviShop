import Axios  from "axios"
import { serverAddress } from "../App"

const getAllCategories=async(setCategories)=>{
    const res=await Axios.get(serverAddress+'category')
    if(res.status===200){
        const data=await res.data
        console.log(data)
        setCategories(data.childCategories)

    }
}
export {getAllCategories}