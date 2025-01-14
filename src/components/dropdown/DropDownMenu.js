import React, { useState, useRef, useEffect } from "react";

export const DropDownMenu = ({
  options,
  disabled,
  addStyle,
  searchBar,
  dropDownValueTwo,
  resetButton,
  menuOptions,
  setDropDownValue,
  setDropDownValueTwo,
  setMenuOptions,
  showMenu,
  handleClick,
  incomingValue,
  handleResetBtnText,
  optionsBoxStyle,
  optionsStyle,
  inputSearchStyle,
  mainRef,
  animateTitle,
}) => {
  const [search, setSearch] = useState("");
  const [menuPosition, setMenuPosition] = useState("");
  const inputRef = useRef(null);
  const handleSearch = (e) => {
    setSearch(e.target.value);
    // formik.setFieldValue("search", e.target.value.toLowerCase())
  };

  useEffect(() => {
    if (searchBar) {
      const arr = [];
      options?.forEach((item) => {
        if (
          item.label &&
          item.label.toLowerCase().includes(search.toLowerCase())
        ) {
          arr.push(item);
        }
      });

      setMenuOptions(arr);
    }
  }, [search]);

  const [globalClick, setGlobalClick] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event.target)) {
        handleClick();
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [menuRef]);

  useEffect(() => {
    if (showMenu) {
      setGlobalClick(true);
    }
    if (searchBar && inputRef) {
      inputRef.current.focus();
    }
  }, []);

  //? commented because it might be extra or unnecessary useEffect
  // useEffect(() => {
  //   if (options) {
  //     setMenuOptions(options);
  //   }
  // }, [options]);
  const handleMenuPosition = () => {};

  useEffect(() => {
    let viewportHeight = window.innerHeight;
    let mainSectionBRC = mainRef.current.getBoundingClientRect();
    let menuHeight = document
      .getElementById("drop_$_down_$_menu")
      .getBoundingClientRect().height;

    const result =
      viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) <
      menuHeight;
    setMenuPosition(result);
  }, []);
  return (
    <>
      {disabled ? (
        ""
      ) : showMenu ? (
        <div
          // className={
          //   addStyle ? "drop-down-menu" : "drop-down-menu hide_drop-down-menu"
          // }

          className={`drop-down-menu ${
            addStyle ? "" : " hide_drop-down-menu "
          } ${searchBar ? " search-height-adjust " : ""} `}
          ref={showMenu && globalClick ? menuRef : null}
          id="drop_$_down_$_menu"
          style={
            menuPosition
              ? {
                  ...optionsBoxStyle,
                  top: "auto",
                  bottom: `${animateTitle ? "85%" : "70%"}`,
                }
              : optionsBoxStyle
          }
        >
          {searchBar ? (
            <div className="drop-down-search-bar">
              <input
                style={inputSearchStyle}
                ref={inputRef}
                type="text"
                placeholder="search here..."
                name="search"
                value={search}
                onChange={handleSearch}
                maxLength={80}
              />
            </div>
          ) : null}

          {resetButton &&
          dropDownValueTwo &&
          !search &&
          (incomingValue ? incomingValue !== dropDownValueTwo : true) ? (
            <div
              className="drop-down-item"
              onClick={() => {
                setDropDownValue(handleResetBtnText());
                setDropDownValueTwo("");
                handleClick();
              }}
              style={optionsStyle}
            >
              <span>{handleResetBtnText()}</span>
            </div>
          ) : null}

          {menuOptions?.length > 0 ? (
            menuOptions?.map(({ label, value }, index) => (
              <div
                key={index}
                className={
                  "drop-down-item" +
                  (dropDownValueTwo === value ? " selectedDropBox" : "")
                }
                onClick={() => {
                  setDropDownValue(label);
                  setDropDownValueTwo(value);
                  handleClick();
                }}
                style={optionsStyle}
              >
                <span>{label}</span>
              </div>
            ))
          ) : (
            <div className="drop-down-item" style={optionsStyle}>
              <span>No Data Found</span>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};
