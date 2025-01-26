import React, { useState, useRef, useEffect } from "react";

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
  incomingValue,
  handleResetBtnText,
  optionsBoxStyle,
  optionsStyle,
  inputSearchStyle,
  mainRef,
  animateTitle,
  handleSetValues,
}) => {
  const [search, setSearch] = useState("");
  const [menuPosition, setMenuPosition] = useState("");
  const inputRef = useRef(null);
  const lastLabelRef = useRef(null);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearchOption = (option) => {
    if (!option?.searchOptions) {
      return option?.label.replaceAll(" ", "")?.toLowerCase();
    }

    return (option?.searchOptions?.join("") + option?.label)
      .replaceAll(" ", "")
      ?.toLowerCase();
  };

  // Debounced search effect
  useEffect(() => {
    if (!searchBar) return; // Exit early if searchBar is not enabled.

    const id = setTimeout(() => {
      if (!search) {
        if (menuOptions.length !== 500 && options?.length > 500) {
          setMenuOptions(options.slice(0, 500));
        } else if (options?.length <= 500) {
          setMenuOptions(options);
        }
        return;
      }

      const filteredOptions = options.filter((item) => {
        const searchValue = search.replaceAll(" ", "").toLowerCase();
        return getSearchOption(item)?.includes(searchValue);
      });

      setMenuOptions(filteredOptions);
    }, 500);

    return () => clearTimeout(id); // Cleanup the previous timer.
  }, [search, searchBar, options, menuOptions.length]);

  const menuRef = useRef();

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event.target)) {
        handleSetValues();

        if (options?.length >= 500) {
          setMenuOptions(options.slice(0, 500));
        } else {
          setMenuOptions(options);
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [menuRef,menuOptions?.length]);

  useEffect(() => {
    if (options?.length > 500) {
      const observer = new IntersectionObserver((elements) => {
        const label = elements[0];
        if (!label.isIntersecting) return;

        setMenuOptions((prevOptions) => [
          ...prevOptions,
          ...options.slice(prevOptions.length, prevOptions.length + 100),
        ]);

        observer.unobserve(label.target);
      });

      if (lastLabelRef.current) {
        observer.observe(lastLabelRef.current);
      }

      return () => observer.disconnect();
    }
  }, [options, lastLabelRef]);

  useEffect(() => {
    if (showMenu) {
      if (searchBar && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [showMenu, searchBar]);

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
  }, [mainRef]);

  const handleLastLabel = (index, length) => {
    if (lastLabelRef && index === length - 120) {
      lastLabelRef.current = null;
      return;
    }
    if (length >= 499 && index === length - 20) {
      return lastLabelRef;
    }
  };

  return (
    <>
      {disabled ? null : showMenu ? (
        <div
          className={`drop-down-menu ${
            addStyle ? "" : " hide_drop-down-menu "
          } ${searchBar ? " search-height-adjust " : ""} `}
          ref={menuRef}
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
          {searchBar && (
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
          )}

          {resetButton &&
          dropDownValueTwo &&
          !search &&
          (incomingValue ? incomingValue !== dropDownValueTwo : true) ? (
            <div
              className="drop-down-item"
              onClick={() => handleSetValues(handleResetBtnText(), "")}
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
                onClick={() => handleSetValues(label, value, index)}
                style={optionsStyle}
              >
                <span
                  ref={
                    menuOptions?.length >= 499
                      ? handleLastLabel(index, menuOptions?.length)
                      : null
                  }
                >
                  {label} {index}
                </span>
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
