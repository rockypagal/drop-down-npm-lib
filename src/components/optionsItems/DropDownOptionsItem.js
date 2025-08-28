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
  multiSelectLimit,
  multiSelect,
}) => {
  // const isSelected = dropDownValueTwo === row?.value;
  const { validValue } = checkIsConvertedValue(dropDownValueTwo); //**********/
  const isSelected = multiSelect
    ? validValue?.includes(row.value)
    : validValue === row?.value;

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
         ? multiSelect
           ? "selectedMultiDropBox"
           : "selectedDropBox"
         : ""
     }

     ${
       isSelected
         ? checkType(selectedOptionItemStyle, "string", {
             ifTrue: selectedOptionItemStyle,
             ifFalse: "",
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
    if (optionsRef.current && index < 100 && !multiSelect) {
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
        style={{
          ...(multiSelect &&
            isSelected && {
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }),
        }}
      >
        {row?.label}{" "}
        {multiSelect && isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="gray"
          >
            <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
          </svg>
        )}
      </span>
    </div>
  );
};

export default memo(DropdownOptionItem);
DropdownOptionItem.displayName = "DropdownOptionsItem";
