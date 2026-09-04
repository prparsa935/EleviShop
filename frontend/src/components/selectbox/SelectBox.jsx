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
      value={props.value}
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
      classNamePrefix="aselect"
      styles={{
        container: (prevCss) => {
          return {
            ...prevCss,
            width: props.width,
          };
        },
        control: (prevCss, state) => {
          return {
            height: props.height,
            ...prevCss,
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
  );
};
export default SelectBox;
