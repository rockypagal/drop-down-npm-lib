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
            if (menuOptions.length !== 500 && options?.length > 500) {
              setMenuOptions(options.slice(0, 500));
            } else if (options?.length <= 500) {
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

        searchBar?.delay && typeof Number(searchBar?.delay) === "number" //*********
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
        handleSetValues();

        setTimeout(() => {
          if (options?.length >= 500) {
            setMenuOptions(options?.slice(0, 500));
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
    if (searchBar && inputRef) {
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
    if (length >= 499 && index === length - 1) {
      return lastLabelRef;
    }
  };
  const observerRef = useRef(null); // Store the observer instance

  useEffect(() => {
    if (options?.length >= 500) {
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
          className={`drop-down-menu ${
            addStyle ? "" : " hide_drop-down-menu "
          } ${searchBar ? " search-height-adjust " : ""} `}
          ref={showMenu && globalClick ? menuRef : null}
          id="drop_$_down_$_menu"
          style={{
            ...optionsBoxStyle,
            ...(menuPosition && {
              top: "auto",
              bottom: `${animateTitle ? "85%" : "70%"}`,
            }),
          }}
        >
          {searchBar ? (
            <div className="drop-down-search-bar">
              <input
                style={inputSearchStyle}
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
              className="drop-down-item"
              onClick={() => {
                handleSetValues({
                  label: handleResetBtnText(),
                  value: "",
                  isReset: true,
                });
              }}
              style={optionsStyle}
            >
              <span>{handleResetBtnText()}</span>
            </div>
          ) : null}

          {menuOptions?.length > 0 ? (
            menuOptions?.map((row, index) => (
              <div
                key={index}
                className={
                  "drop-down-item" +
                  (dropDownValueTwo === row?.value ? " selectedDropBox" : "")
                }
                onClick={() => {
                  handleSetValues(
                    row,
                    index,
                    options?.length,
                    search?.query && search?.touched
                  );
                }}
                style={optionsStyle}
              >
                <span
                  ref={
                    menuOptions?.length >= 500
                      ? handleLastLabel(index, menuOptions?.length)
                      : null
                  }
                >
                  {row?.label}
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
