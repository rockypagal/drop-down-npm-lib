
import React, { memo, useEffect, useRef, useState } from "react";
import {
  checkIsConvertedValue,
  checkType,
  focusTheMain,
  handleKeyDown,
  trim,
} from "../../helper/helper"; // Adjust path as needed

const DropdownOptionItem = ({
  row,
  index,
  inputRef,
  search,
  dropDownValueTwo,
  optionItemStyle,
  selectedOptionItemStyle,
  handleSetValues,
  mainRef,
  options,
  setMenuOptions,
  menuOptions,
  searchBar,
  resetButton,
  handleLastLabel,
}) => {
  // const isSelected = dropDownValueTwo === row?.value;
  const { validValue } = checkIsConvertedValue(dropDownValueTwo); //**********/
  const isSelected = validValue === row?.value;
  const optionsRef = useRef(null);
  const isSearchActive =
    index === 0 &&
    search?.query &&
    search?.searchComplete &&
    document.activeElement === inputRef?.current;

  const className = trim(
    `drop-down-item 
     ${checkType(optionItemStyle, "string", {
       ifTrue: optionItemStyle,
       ifFalse: "",
     })} 
     ${
       isSelected
         ? checkType(selectedOptionItemStyle, "string", {
             ifTrue: selectedOptionItemStyle,
             ifFalse: "selectedDropBox",
           })
         : ""
     }
     ${isSearchActive ? "search-active" : ""}`
  );

  const style = {
    ...(checkType(optionItemStyle, "object") ? optionItemStyle : {}),
    ...(isSelected && checkType(selectedOptionItemStyle, "object")
      ? selectedOptionItemStyle
      : {}),
  };

  useEffect(() => {
    if (optionsRef.current && index < 100) {
      /* *********** */
      optionsRef.current.focus();
    }
  }, []);
  return (
    <div
      className={className}
      style={style}
      ref={isSelected ? optionsRef : index === 0 ? optionsRef : null}
      tabIndex={0}
      onClick={() => {
        handleSetValues(
          row,
          index,
          options?.length,
          search?.query && search?.touched
        );
        focusTheMain(mainRef);
      }}
      onKeyDown={(e) =>
        handleKeyDown({
          handleSetValues,
          mainRef,
          options,
          setMenuOptions,
          search,
          menuOptions,
          resetButton,
          dropDownValueTwo,
          searchBar,
          inputRef,
          row,
          index,
          e,
        })
      }
    >
      <span
        ref={
          menuOptions?.length >= 100
            ? handleLastLabel(index, menuOptions?.length)
            : null
        }
      >
        {row?.label}
      </span>
    </div>
  );
};

export default memo(DropdownOptionItem);
DropdownOptionItem.displayName = "DropdownOptionsItem";