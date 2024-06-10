import SearchFilter from "../components/searchfilter/SearchFilter"
import SearchProductList from "../components/searchproductlist/SearchProductList"


const Search=()=>{
    return(
        <div className="container mx-auto max-w-screen-2xl flex  mt-5   ">
            {/* filter */}
            <SearchFilter/>
            <SearchProductList/>
  
            
       
            
        
        </div>

    )
}
export default Search