import React, { useState } from 'react';
import reactSelect from 'react-select';
import AsyncSelect from 'react-select/async';





const ASelectBox= (props) => {
  
// sample for load options
  // const loadOptions=(inputValue,callback)=>{
  //   console.log('hello')
  //   callback([{value:Math.random(),label:'تخم سگ'}])
  //   }



  return (
      
      <AsyncSelect
      
        placeholder={props.placeHolder}
        className={props.className}
        defaultValue={props.defaultValue}
        isDisabled={props.disabled}
        isLoading={props.isLoading}
        isClearable={props.isClearable}
        isRtl={true}
        isSearchable={props.isSearchable}
        name={props.name}
        noOptionsMessage={()=>{
          return<div>موردی یافت نشد  </div>
        }}
        loadOptions={props.loadOptions}
 
        isMulti={props.isMulti}
        
        styles={{
          container:(prevCss)=>{
            return({
              ...prevCss,
              width:props.width,
         
           
            })
          
        },
          control:(prevCss)=>{
            return({
              height:props.height,
              ...prevCss,
              
       
              
            })
          
        },
      //   menu:(prevCss)=>{
      //     return({
      //       ...prevCss,
            
            
     
            
      //     })
        
      // },
      }}
      />


 
  );
};
export default ASelectBox