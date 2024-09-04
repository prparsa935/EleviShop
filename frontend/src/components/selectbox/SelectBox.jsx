import React, { useState } from "react";
import Select from "react-select";

const SelectBox = (props) => {
  return (
    <Select
      onChange={props.onChange}
      options={props.options}
      placeholder={props.placeHolder}
      className={props.className}
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
      isMulti={props.isMulti}
      styles={{
        container: (prevCss) => {
          return {
            ...prevCss,
            width: props.width,
          };
        },
        control: (prevCss) => {
          return {
            height: props.height,
            ...prevCss,
          };
        },
      }}
    />
  );
};
export default SelectBox;
