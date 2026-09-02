import React, { useState } from "react";
import reactSelect from "react-select";
import AsyncSelect from "react-select/async";

const ASelectBox = (props) => {
  // sample for load options
  // const loadOptions=(inputValue,callback)=>{

  //   callback([{value:Math.random(),label:'تخم سگ'}])
  //   }

  return (
    <>
      <AsyncSelect
        placeholder={props.placeHolder}
        className={props.className}
        value={props.value || props.defaultValue}
        defaultValue={props.defaultValue}
        isDisabled={props.disabled}
        isLoading={props.isLoading}
        isClearable={props.isClearable}
        isRtl={true}
        isSearchable={props.isSearchable}
        name={props.name}
        noOptionsMessage={() => {
          return <div>موردی یافت نشد </div>;
        }}
        loadOptions={props.loadOptions}
        isMulti={props.isMulti}
        classNamePrefix="aselect"
        onChange={props.onChange}
        styles={{
          container: (prevCss) => {
            return {
              ...prevCss,
              width: props.width,
            };
          },
          control: (prevCss, state) => {
            return {
              ...prevCss,
              height: props.height,
              backgroundColor: "var(--glass-bg-strong)",
              color: "var(--color-white)",
              borderColor: state.isFocused
                ? "var(--color-gold)"
                : "var(--glass-border)",
              boxShadow: state.isFocused
                ? "0 0 0 1px var(--color-gold)"
                : "none",
              ":hover": {
                borderColor: "var(--color-gold)",
              },
            };
          },
          singleValue: (prevCss) => ({
            ...prevCss,
            color: "var(--color-white)",
          }),
          input: (prevCss) => ({
            ...prevCss,
            color: "var(--color-white)",
          }),
          placeholder: (prevCss) => ({
            ...prevCss,
            color: "var(--sub-text-color)",
          }),
          menu: (prevCss) => ({
            ...prevCss,
            backgroundColor: "var(--color-productcolor)",
            border: "1px solid var(--glass-border)",
            zIndex: 50,
          }),
          menuList: (prevCss) => ({
            ...prevCss,
            backgroundColor: "var(--color-productcolor)",
          }),
          option: (prevCss, state) => ({
            ...prevCss,
            color: "var(--color-white)",
            backgroundColor: state.isSelected
              ? "var(--color-gold-light)"
              : state.isFocused
              ? "var(--color-383946)"
              : "var(--color-productcolor)",
          }),
        }}
      />
      {props?.error && (
        <div className=" text-red-500 font-semibold text-sm mt-2">
          {props.error}
        </div>
      )}
    </>
  );
};
export default ASelectBox;
