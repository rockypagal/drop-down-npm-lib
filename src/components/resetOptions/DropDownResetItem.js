import React, { memo } from "react";
import { keys } from "../../constant/constant";
import { checkType } from "../../helper/helper";

const DropdownResetItem = ({
  optionItemStyle,
  handleResetBtnText,
  handleSetValues,
  focusTheMain,
  mainRef,
  options,
  setMenuOptions,
  resetOptionsList,
  inputRef,
  menuOptions,
  search,
}) => {
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Tab":
        e.preventDefault();
        handleSetValues({ key: keys?.globalKey });
        focusTheMain(mainRef);
        resetOptionsList({ options, setMenuOptions });
        break;

      case "Enter":
        e.preventDefault();
        handleSetValues({
          label: handleResetBtnText(),
          value: "",
          key: keys?.resetKey,
        });
        focusTheMain(mainRef);
        break;

      case "ArrowDown":
        e.preventDefault();
        if (menuOptions?.length > 0) {
          e.target.nextElementSibling?.focus();
        }
        break;

      default:
        if (search) {
          inputRef?.current?.focus();
        }
        break;
    }
  };

  return (
    <div
      className={`drop-down-item ${checkType(optionItemStyle, "string", {
        ifTrue: optionItemStyle,
        ifFalse: "",
      })}`}
      style={{
        ...(optionItemStyle &&
          checkType(optionItemStyle, "object") &&
          optionItemStyle),
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleSetValues({
          label: handleResetBtnText(),
          value: "",
          key: keys?.resetKey,
        });
        focusTheMain(mainRef);
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <span>{handleResetBtnText()}</span>
    </div>
  );
};

export default memo(DropdownResetItem);
DropdownResetItem.displayName = "DropdownResetItem";
