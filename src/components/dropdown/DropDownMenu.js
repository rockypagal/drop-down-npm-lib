import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  checkType,
  focusTheMain,
  resetOptionsList,
  trim,
} from "../../helper/helper";
import { keys } from "../../constant/constant";

export const DropDownMenu = ({
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
  const handleSearch = (e) => {
    setSearch({ ...search, query: e.target.value, touched: true });
  };

  const getSearchOption = (option) => {
    if (!option?.searchOptions && checkType(option?.label, "string")) {
      return option?.label.replaceAll(" ", "")?.toLowerCase();
    }

    return (option?.searchOptions?.join("") + option?.label)
      .replaceAll(" ", "")
      ?.toLowerCase();
  };

  useEffect(() => {
    let id;
    if (searchBar && search?.touched) {
      setSearch({ ...search, searchComplete: false, totalSearchedResult: [] });
      if (searchBar?.onSearch && checkType(searchBar?.onSearch, "function")) {
        searchBar?.onSearch(search?.query, options);
        return;
      }

      id = setTimeout(
        () => {
          if (!search?.query) {
            if (options?.length > 100) {
              setMenuOptions(options.slice(0, 100));
            } else if (options?.length <= 100) {
              setMenuOptions(options);
            }
            return;
          }

          const arr = options.filter((item) => {
            const newSearchQuery = search?.query
              .replaceAll(" ", "")
              ?.toLowerCase();

            if (item?.searchOptions) {
              return getSearchOption(item)?.includes(newSearchQuery);
            } else {
              return getSearchOption(item)?.includes(newSearchQuery);
            }
          });
          setMenuOptions(arr?.length > 100 ? arr?.slice(0, 100) : arr);
          setSearch({
            ...search,
            searchComplete: true,
            totalSearchedResult: arr?.length > 100 ? arr : [],
          });
        },

        (searchBar?.delay || searchBar?.delay === 0) &&
          checkType(Number(searchBar?.delay), "number")
          ? searchBar?.delay
          : 400
      );
    }
    return () => {
      clearTimeout(id);
    };
  }, [search?.query]);

  const [globalClick, setGlobalClick] = useState(false);

  const menuRef = useRef();

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
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [menuRef, menuOptions?.length]);

  //* optimize this this
  useLayoutEffect(() => {
    const calculatePosition = () => {
      const viewportHeight = window.innerHeight;
      const mainSectionBRC = mainRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const menuElement = document.getElementById("drop_$_down_$_menu");

      const menuHeight = menuElement?.getBoundingClientRect().height || 0;
      menuPosition; // temporary

      setMenuPosition({
        // openUp:
        //   viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) <
        //   menuHeight,

        top: `${
          viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) <
          menuElement?.getBoundingClientRect().height
            ? mainSectionBRC?.bottom -
              menuHeight -
              mainSectionBRC?.height -
              3 +
              scrollY +
              (titlePosition
                ? mainRef.current?.firstChild?.getBoundingClientRect()?.height
                : 0)
            : mainSectionBRC?.bottom + 3 + scrollY
        }px`,
        left: `${mainSectionBRC?.left}px`,
        width: `${mainSectionBRC?.width}px`,
      });
    };
    calculatePosition();
    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition);
    const resizeObserver = new ResizeObserver(calculatePosition);
    resizeObserver.observe(document.getElementById("drop_$_down_$_menu"));
    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition);
      resizeObserver.disconnect();
    };
  }, [
    mainRef.current.getBoundingClientRect().left,
    mainRef.current.getBoundingClientRect().bottom,
    search.searchComplete,
    menuOptions?.length,
  ]);

  useEffect(() => {
    if (showMenu) {
      setGlobalClick(true);
    }

    // Handle onOpen callback function
    if (onOpen && checkType(onOpen, "function")) {
      onOpen();
    }
    //*******
    // const menuElement = document.getElementById("drop_$_down_$_menu");
    // menuElement.firstChild.focus();
  }, []);

  const handleLastLabel = (index, length) => {
    if (lastLabelRef && index === length - 101) {
      lastLabelRef.current = null;
      return;
    }
    if (length >= 100 && index === length - 1) {
      return lastLabelRef;
    }
  };
  const observerRef = useRef(null); // Store the observer instance

  useEffect(() => {
    if (options?.length >= 100) {
      // Create the observer only if it doesn't already exist
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver((elements) => {
          const label = elements[0];
          if (!label.isIntersecting) return;

          // Add more options when the last label is visible
          setMenuOptions((prev) => {
            if (search?.query) {
              return search.totalSearchedResult?.slice(0, prev.length + 100);
            }
            return options?.slice(0, prev.length + 100);
          });

          // Unobserve the current element after it triggers
          observerRef.current?.unobserve(label.target);
        });
      }

      // Observe the last label if available
      if (lastLabelRef.current) {
        observerRef.current.observe(lastLabelRef.current);
      }
    }

    // Cleanup function
    return () => {
      // Disconnect the observer only on unmount
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null; // Clear the reference
      }
    };
  }, [options, menuOptions, setMenuOptions]);

  const handleKeyDown = (e, index, row) => {
    if (["Tab", "Enter", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === "Tab") {
      handleSetValues({ key: keys?.globalKey });
      focusTheMain(mainRef);
      resetOptionsList({ options, setMenuOptions });
    } else if (e.key === "Enter") {
      handleSetValues(
        row,
        index, // ***********
        options?.length,
        search?.query && search?.touched
      );
      focusTheMain(mainRef);
    } else if (e.key === "ArrowDown") {
      if (index < menuOptions?.length - 1) {
        e.target.nextElementSibling.focus();
      }
    } else if (
      e.key === "ArrowUp" &&
      (index > 0 || (resetButton && dropDownValueTwo && !search.query))
    ) {
      e.target.previousElementSibling.focus();
    } else if (search) {
      // setSearch({ query: e.key, touched: true });
      inputRef?.current?.focus();
    }
  };

  return (
    <>
      {disabled ? (
        ""
      ) : showMenu ? (
        <div
          className={trim(`drop-down-menu ${scrollbarClass} ${
            addStyle ? "" : " hide_drop-down-menu "
          } ${searchBar ? " search-height-adjust " : ""} 
          ${checkType(optionsContainer, "string", {
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
            //   bottom: `${animateTitle ? "115%" : "105%"}`, //*******
            // }
            // ),
          }}
        >
          {searchBar && menuPosition?.top ? (
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
                autoFocus // ***********
                type="text"
                placeholder={searchBar?.placeholder ?? "search here..."}
                name="search"
                value={search?.query}
                onChange={handleSearch}
                maxLength={80}
                onKeyDown={(e) => {
                  if (e.key === "Tab" && showMenu) {
                    e.preventDefault();
                    handleSetValues({ key: keys?.globalKey });
                    focusTheMain(mainRef);
                    resetOptionsList({ options, setMenuOptions });
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    e.target.parentElement.nextElementSibling.focus();
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
                    // *******
                    focusTheMain(mainRef);
                  }
                }}
                onFocus={() => {
                  setSearch({ ...search, activeFocus: true });
                }}
                onBlur={() => {
                  setSearch({ ...search, activeFocus: false });
                }}
                autoComplete="off"
              />
            </div>
          ) : null}

          {resetButton &&
          dropDownValueTwo &&
          !loading &&
          !search?.query &&
          menuPosition?.top ? (
            <div
              className={`drop-down-item ${checkType(
                optionItemStyle,
                "string",
                {
                  ifTrue: optionItemStyle,
                  ifFalse: "",
                }
              )} `}
              onClick={(e) => {
                e.stopPropagation();
                handleSetValues({
                  label: handleResetBtnText(),
                  value: "",
                  key: keys?.resetKey,
                });
                focusTheMain(mainRef);
              }}
              style={{
                ...(optionItemStyle &&
                  checkType(optionItemStyle, "object") &&
                  optionItemStyle),
              }}
              tabIndex={0} // ***********
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSetValues({
                    label: handleResetBtnText(),
                    value: "",
                    key: keys?.resetKey,
                  });
                  focusTheMain(mainRef);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (menuOptions?.length > 0) {
                    e.target.nextElementSibling.focus();
                  }
                } else if (e.key !== "Tab" && search) {
                  // setSearch({ query: e.key, touched: true });
                  inputRef?.current?.focus();
                }
              }}
              // onKeyDown={handleKeyDown}
            >
              <span>{handleResetBtnText()}</span>
            </div>
          ) : null}

          {loading ? (
            <div className="drop-down-item">Loading...</div>
          ) : menuPosition?.top && menuOptions?.length > 0 ? (
            menuOptions?.map((row, index) => (
              <FocusElement key={`${row.value}` + index} index={index}>
                <div
                  // className={
                  //   "drop-down-item" +
                  //   (dropDownValueTwo === row?.value ? " selectedDropBox" : "")
                  // }

                  className={trim(`drop-down-item ${checkType(
                    optionItemStyle,
                    "string",
                    {
                      ifTrue: optionItemStyle,
                      ifFalse: "",
                    }
                  )}
                  ${
                    dropDownValueTwo === row?.value
                      ? checkType(selectedOptionItemStyle, "string", {
                          ifTrue: selectedOptionItemStyle,
                          ifFalse: " selectedDropBox",
                        })
                      : ""
                  }
                  ${
                    index === 0 &&
                    search.query &&
                    search.searchComplete &&
                    document.activeElement === inputRef.current
                      ? " search-active "
                      : ""
                  }
                  
                  `)}
                  onClick={() => {
                    handleSetValues(
                      row,
                      index,
                      options?.length,
                      search?.query && search?.touched
                    );
                    // *******
                    focusTheMain(mainRef);
                  }}
                  style={{
                    ...(optionItemStyle &&
                      checkType(optionItemStyle, "object") &&
                      optionItemStyle),
                    ...(selectedOptionItemStyle &&
                      dropDownValueTwo === row?.value &&
                      checkType(selectedOptionItemStyle, "object") &&
                      selectedOptionItemStyle),
                  }}
                  tabIndex={0} // ***********
                  onKeyDown={(e) => handleKeyDown(e, index, row)}
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
};
const FocusElement = ({ children, index }) => {
  useEffect(() => {
    if (index === 0) {
      const menuElement = document.getElementById("drop_$_down_$_menu");
      menuElement.firstChild.focus();
    }
  }, []);
  return <>{children}</>;
};
