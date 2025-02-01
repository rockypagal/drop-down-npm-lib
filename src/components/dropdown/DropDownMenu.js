import React, { useState, useRef, useEffect } from "react";
import { checkType, trim } from "../../helper/helper";
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
  animateTitle,
  handleSetValues,
}) => {
  const [search, setSearch] = useState({ query: "", touched: false });
  const [menuPosition, setMenuPosition] = useState("");
  const inputRef = useRef(null);
  let lastLabelRef = useRef(null);
  const handleSearch = (e) => {
    setSearch({ query: e.target.value, touched: true });
  };

  const getSearchOption = (option) => {
    if (!option?.searchOptions) {
      return option?.label.replaceAll(" ", "")?.toLowerCase();
    }

    return (option?.searchOptions?.join("") + option?.label)
      .replaceAll(" ", "")
      ?.toLowerCase();
  };
  useEffect(() => {
    let id;
    if (searchBar && search?.touched) {
      id = setTimeout(
        () => {
          if (!search?.query) {
            if (menuOptions.length !== 100 && options?.length > 100) {
              setMenuOptions(options.slice(0, 100));
            } else if (options?.length <= 100) {
              setMenuOptions(options);
            }
            return;
          }

          const arr = options.filter((item) => {
            if (item?.searchOptions) {
              return getSearchOption(item)?.includes(
                search?.query.replaceAll(" ", "")?.toLowerCase()
              );
            } else {
              return getSearchOption(item)?.includes(
                search?.query.replaceAll(" ", "").toLowerCase()
              );
            }
          });
          setMenuOptions(arr);
        },

        searchBar?.delay && checkType(Number(searchBar?.delay), "number")
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
      if (menuRef?.current && !menuRef?.current?.contains(event.target)) {
        handleSetValues({ key: keys?.globalKey });

        setTimeout(() => {
          if (options?.length >= 100) {
            setMenuOptions(options?.slice(0, 100));
          } else {
            setMenuOptions(options);
          }
        }, 250);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [menuRef, menuOptions?.length]);

  useEffect(() => {
    if (showMenu) {
      setGlobalClick(true);
    }
    if (searchBar && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const calculatePosition = () => {
      const viewportHeight = window.innerHeight;
      const mainSectionBRC = mainRef.current.getBoundingClientRect();
      const menuHeight =
        document.getElementById("drop_$_down_$_menu")?.getBoundingClientRect()
          .height || 0;

      setMenuPosition(
        viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) <
          menuHeight
      );
    };

    calculatePosition();
    window.addEventListener("resize", calculatePosition);

    return () => window.removeEventListener("resize", calculatePosition);
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
          setMenuOptions((prev) => options?.slice(0, prev.length + 100));

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

  return (
    <>
      {disabled ? (
        ""
      ) : showMenu ? (
        <div
          className={trim(`drop-down-menu ${
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
            ...(menuPosition && {
              top: "auto",
              bottom: `${animateTitle ? "85%" : "70%"}`,
            }),
          }}
        >
          {searchBar ? (
            <div className="drop-down-search-bar">
              <input
                className={`drop-down-search-input ${checkType(inputSearchStyle, "string", {
                  ifTrue: inputSearchStyle,
                  ifFalse: "",
                })}`}
                style={{
                  ...(inputSearchStyle &&
                    checkType(inputSearchStyle, "object") &&
                    inputSearchStyle),
                }}
                ref={inputRef}
                type="text"
                placeholder="search here..."
                name="search"
                value={search?.query}
                onChange={handleSearch}
                maxLength={80}
              />
            </div>
          ) : null}

          {resetButton && dropDownValueTwo && !search?.query ? (
            <div
              className={`drop-down-item ${checkType(
                optionItemStyle,
                "string",
                {
                  ifTrue: optionItemStyle,
                  ifFalse: "",
                }
              )}`}
              onClick={() => {
                handleSetValues({
                  label: handleResetBtnText(),
                  value: "",
                  key: keys?.resetKey,
                });
              }}
              style={{
                ...(optionItemStyle &&
                  checkType(optionItemStyle, "object") &&
                  optionItemStyle),
              }}
            >
              <span>{handleResetBtnText()}</span>
            </div>
          ) : null}

          {menuOptions?.length > 0 ? (
            menuOptions?.map((row, index) => (
              <div
                key={index}
                // className={
                //   "drop-down-item" +
                //   (dropDownValueTwo === row?.value ? " selectedDropBox" : "")
                // }

                className={trim(`drop-down-item ${checkType(optionItemStyle, "string", {
                   ifTrue: optionItemStyle,
                   ifFalse: "",
                 })}
                  ${
                  dropDownValueTwo === row?.value ?
                  checkType(selectedOptionItemStyle, "string", {
                    ifTrue: selectedOptionItemStyle,
                    ifFalse: " selectedDropBox",
                  }):""
                }`)}
                onClick={() => {
                  handleSetValues(
                    row,
                    index,
                    options?.length,
                    search?.query && search?.touched
                  );
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
              <span>No Data Found</span>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};
