import React, { memo } from "react";
import { checkType } from "../../helper/helper"; // adjust path if needed
import { keys } from "../../constant/constant"; // adjust path if needed

const DropdownSearchInput = ({
  inputRef,
  menuRef,
  mainRef,
  showMenu,
  search,
  setSearch,
  handleSearch,
  handleSetValues,
  options,
  menuOptions,
  setMenuOptions,
  searchBar,
  inputSearchStyle,
  focusTheMain,
  resetOptionsList,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Tab" && showMenu) {
      e.preventDefault();
      handleSetValues({ key: keys?.globalKey });
      focusTheMain(mainRef);
      resetOptionsList({ options, setMenuOptions });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      e.target.parentElement.nextElementSibling?.focus();
    } else if (
      e.key === "Enter" &&
      menuOptions?.length > 0 &&
      search.query &&
      search.touched &&
      search?.searchComplete
    ) {
      const row = menuOptions[0];
      handleSetValues(
        row,
        0,
        options?.length,
        search?.query && search?.touched
      );
      focusTheMain(mainRef);
    }
  };

  return (
    <div className="drop-down-search-bar">
      <input
        className={`drop-down-search-input ${checkType(
          inputSearchStyle,
          "string",
          {
            ifTrue: inputSearchStyle,
            ifFalse: "",
          }
        )}`}
        style={{
          ...(inputSearchStyle &&
            checkType(inputSearchStyle, "object") &&
            inputSearchStyle),
        }}
        ref={inputRef}
        autoFocus
        type="text"
        placeholder={searchBar?.placeholder ?? "search here..."}
        name="search"
        value={search?.query}
        onChange={handleSearch}
        maxLength={80}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setSearch({ ...search, activeFocus: true });
          if (menuRef.current && menuRef.current.scrollTop > 0) {
            menuRef.current.scrollTop = 0;
          }
        }}
        onBlur={() => {
          setSearch({ ...search, activeFocus: false });
        }}
        autoComplete="off"
      />
    </div>
  );
};

export default memo(DropdownSearchInput);
DropdownSearchInput.displayName = "DropDown Search";
