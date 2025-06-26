import React, { memo, useEffect, useRef, useState } from "react";
import { keys, onOpenInitialValue } from "../../constant/constant";
import {
  checkType,
  focusTheMain,
  handleKeyDown,
  resetOptionsList,
  trim,
} from "../../helper/helper";
import { useDynamicPosition } from "../../hooks/DropDownMenu/dynamicPositionHooks";
import { useDebouncedDropdownSearch } from "../../hooks/DropDownMenu/searchAndDebounceHook";
import { useInfiniteScroll } from "../../hooks/DropDownMenu/dynamicScrollingHook";
import DropdownSearchInput from "../Search/SearchComponent";
import DropDownResetItem from "../resetOptions/DropDownResetItem";
import DropDownOptionsItem from "../optionsItems/DropDownOptionsItem";

export const DropDownMenu = memo(
  ({
    options,
    disabled,
    addStyle,
    searchBar,
    dropDownValueTwo,
    resetButton,
    menuOptions,
    setMenuOptions,
    showMenu,
    handleResetBtnText,
    optionsContainer,
    optionItemStyle,
    inputSearchStyle,
    selectedOptionItemStyle,
    mainRef,
    handleSetValues,
    loading,
    scrollbarClass,
    noDataMessage,
    titlePosition,
    onOpen,
    scrollListenerTarget,
    dynamicPositioning,
    animateTitle,
    contextCollectionRef,
  }) => {
    const [search, setSearch] = useState({
      query: "",
      touched: false,
      searchComplete: false,
      activeFocus: false,
      totalSearchedResult: [],
    });
    const [menuPosition, setMenuPosition] = useState({});
    const inputRef = useRef(null);
    let lastLabelRef = useRef(null);
    const menuRef = useRef();
    const handleSearch = (e) => {
      setSearch({ ...search, query: e.target.value, touched: true });
    };

    useDebouncedDropdownSearch({
      search,
      setSearch,
      options,
      setMenuOptions,
      searchBar,
      delay: searchBar?.delay,
    });

    const [globalClick, setGlobalClick] = useState(false);

    useEffect(() => {
      const handleGlobalClick = (event) => {
        if (
          menuRef?.current &&
          !menuRef?.current?.contains(event.target) &&
          !mainRef?.current?.contains(event.target)
        ) {
          handleSetValues({ key: keys?.globalKey });

          // setTimeout(() => {
          //   if (options?.length >= 100) {
          //     setMenuOptions(options?.slice(0, 100));
          //   } else {
          //
          //     setMenuOptions(options);
          //   }
          // }, 250);
          resetOptionsList({ options, setMenuOptions });
        }
      };

      document.addEventListener("click", handleGlobalClick);
      // const resizeObserver = new ResizeObserver(handleGlobalClick);
      // resizeObserver.observe(document.getElementById("drop_$_down_$_menu"));
      return () => {
        document.removeEventListener("click", handleGlobalClick);
        // resizeObserver.disconnect();
      };
    }, [menuRef, menuOptions?.length]);

    useEffect(() => {
      if (showMenu) {
        setGlobalClick(true);
      }

      // Handle onOpen callback function
      if (onOpen && checkType(onOpen, "function")) {
        onOpen(dropDownValueTwo, {
          ...(contextCollectionRef.current || onOpenInitialValue),
          triggeredBy: "onOpen",
        });
      }
      //*******
      // const menuElement = document.getElementById("drop_$_down_$_menu");
      // menuElement.firstChild.focus();
    }, []);

    const handleLastLabel = (index, length) => {
      // if (lastLabelRef && index === length - 101) {
      //   lastLabelRef.current = null;
      //   return;
      // }
      if (length >= 100 && index === length - 1) {
        return lastLabelRef;
      }
    };

    useInfiniteScroll({
      enabled: options.length >= 100,
      options,
      search,
      setMenuOptions,
      lastItemRef: lastLabelRef,
      menuOptions,
      chunkSize: 100,
    });

    useDynamicPosition({
      dynamicPositioning,
      setMenuPosition,
      mainRef,
      animateTitle,
      search,
      menuOptions,
      menuRef,
      titlePosition,
      handleSetValues,
    });

    return (
      <>
        {disabled ? (
          ""
        ) : showMenu ? (
          <div
            className={trim(`drop-down-menu ${scrollbarClass} ${
              addStyle ? "" : " hide_drop-down-menu "
            }${checkType(optionsContainer, "string", {
              ifTrue: optionsContainer,
              ifFalse: "",
            })}
          `)}
            ref={showMenu && globalClick ? menuRef : null}
            id="drop_$_down_$_menu"
            style={{
              ...(optionsContainer &&
                checkType(optionsContainer, "object") &&
                optionsContainer),
              ...menuPosition,
              // ...(menuPosition && {
              //   top: "auto",
              //   bottom: `${animateTitle ? "115%" : "103%"}`, //*******
              // }),
            }}
          >
            {searchBar && menuPosition?.top ? (
              <DropdownSearchInput
                inputRef={inputRef}
                menuRef={menuRef}
                mainRef={mainRef}
                showMenu={showMenu}
                search={search}
                setSearch={setSearch}
                handleSearch={handleSearch}
                handleSetValues={handleSetValues}
                options={options}
                menuOptions={menuOptions}
                setMenuOptions={setMenuOptions}
                searchBar={searchBar}
                inputSearchStyle={inputSearchStyle}
                focusTheMain={focusTheMain}
                resetOptionsList={resetOptionsList}
              />
            ) : null}
            {resetButton &&
            dropDownValueTwo &&
            !loading &&
            !search?.query &&
            menuPosition?.top ? (
              <DropDownResetItem
                optionItemStyle={optionItemStyle}
                handleResetBtnText={handleResetBtnText}
                handleSetValues={handleSetValues}
                focusTheMain={focusTheMain}
                mainRef={mainRef}
                options={options}
                setMenuOptions={setMenuOptions}
                resetOptionsList={resetOptionsList}
                inputRef={inputRef}
                menuOptions={menuOptions}
                search={search}
              />
            ) : null}
            {loading ? (
              <div className="drop-down-item">Loading...</div>
            ) : checkType(menuPosition, "object", {
                ifTrue: menuPosition?.top,
                ifFalse: true,
              }) && menuOptions?.length > 0 ? (
              menuOptions?.map((row, index) => (
                <FocusElement
                  key={`${row.value}` + index}
                  index={index}
                  menuRef={menuRef}
                  searchBar={searchBar}
                >
                  <DropDownOptionsItem
                    row={row}
                    index={index}
                    inputRef={inputRef}
                    search={search}
                    dropDownValueTwo={dropDownValueTwo}
                    optionItemStyle={optionItemStyle}
                    selectedOptionItemStyle={selectedOptionItemStyle}
                    handleSetValues={handleSetValues}
                    mainRef={mainRef}
                    options={options}
                    setMenuOptions={setMenuOptions}
                    menuOptions={menuOptions}
                    searchBar={searchBar}
                    resetButton={resetButton}
                    handleLastLabel={handleLastLabel}
                  />
                </FocusElement>
              ))
            ) : (
              <div
                className={`drop-down-item ${checkType(
                  optionItemStyle,
                  "string",
                  {
                    ifTrue: optionItemStyle,
                    ifFalse: "",
                  }
                )}`}
                style={{
                  ...(optionItemStyle &&
                    checkType(optionItemStyle, "object") &&
                    optionItemStyle),
                }}
              >
                <span>{noDataMessage}</span>
              </div>
            )}
          </div>
        ) : null}
      </>
    );
  }
);
const FocusElement = memo(({ children, index, menuRef, searchBar }) => {
  // useEffect(() => {
  //   if (index === 0 && !searchBar) {
  //     const menuElement = menuRef.current;

  //     if (menuElement?.firstChild) {
  //       menuElement?.firstChild?.focus();
  //     }
  //   }
  // }, []);
  return <>{children}</>;
});

DropDownMenu.displayName = "DropDown Menu";
FocusElement.displayName = "Menu Options";
