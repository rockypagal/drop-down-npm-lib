/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./dropdown-style.css";
const DropDownBox = ({
  dropDownTitle, // ? provide string to show label for drop down
  animateDropDownTitle, // ? this is boolean value which allow this dropDownTitle to animate on focus or if use select any value
  options, // ? here provide array [{label:"America",value:"america"}] component will use this data to show options and set value on onclick
  placeholder, // ? provide string to show placeholder for drop down it can be use stand alone or with dropDownTitle
  size, // ? provide the values in string as "small","medium","large", or "mini" to set predefine sizes for drop down
  showSearchBar, // ? provide boolean to show search bar in drop down
  customSetter, // ? provide set function of useState or formik.setFieldValue to get selected value
  customFormikLabel, // ? provide string to use formik.setFieldValue
  customDropBoxStyles, // ? provide styles in object to style the select box
  disabled = false, // ? provide boolean to disable drop down
  customTextStyle, // ? provide styles to style text in drop down
  titleStyle = {}, //? provide the object with 2 object {labelDown:{style},labelUp:{style}}
  incomingValue, // ? provide incoming string value which will be set on render
  resetButton, // ? provide boolean or string to show reset button clear selected value
  callCustomFunction, // ? provide formik.setValue
  customValueForCustomFunction, // ? value for formik.setValue
  listApi,
  apiData = {}, //? provide object or any data that you want to send with the request
  dispatch,
  listOfKeyValue, //? provide a object containing labelKey and valueKey ex-> {labelKey:"productName",valueKey:"productId"}
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [addStyle, setAddStyle] = useState(false);
  const [menuOptions, setMenuOptions] = useState(options);
  const [dropDownValue, setDropDownValue] = useState(placeholder);
  const [dropDownValueTwo, setDropDownValueTwo] = useState("");
  const [timerId, setTimerId] = useState(null);
  const handleClick = (e) => {
    setAddStyle(!addStyle);
    // formik.setFieldValue("search", "")
    DropBoxVisibility();
  };
  function DropBoxVisibility() {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
    if (showMenu) {
      const styleTimer = setTimeout(() => {
        setShowMenu(false);
        // clearTimeout(styleTimer);
      }, 200);
      setTimerId(styleTimer);
    } else {
      setShowMenu(true);
    }
  }

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);
  // ? function to set reset button value
  const handleResetBtnText = () => {
    return typeof resetButton === "string" ? resetButton : "All";
  };
  // async function apiCall() {
  //   const response = await dispatch(listApi(apiData)) // ? return array containing value
  //
  //   if (options.length === 0) {
  //     const options = response?.payload?.map(item => {
  //       return { label: item.name, value: item._id }
  //     })

  //     // if (menuOptions.length === 0) {
  //     //   setMenuOptions(options)
  //     //   setCheck(false)
  //     // }
  //   }
  // }

  useEffect(() => {
    if (dropDownValueTwo || dropDownValue === handleResetBtnText()) {
      if (callCustomFunction && dropDownValueTwo) {
        callCustomFunction(dropDownValueTwo, customValueForCustomFunction);
      } else if (customFormikLabel && dropDownValueTwo) {
        customSetter(customFormikLabel, dropDownValueTwo);
      } else {
        customSetter(dropDownValueTwo);
      }
      if (dropDownValue === handleResetBtnText()) {
        setDropDownValue(placeholder ? placeholder : "");
      }
    }
  }, [dropDownValueTwo]);

  useEffect(() => {
    options?.forEach((item) => {
      const { label, value } = item;

      if (value === incomingValue) {
        setDropDownValueTwo(value);
        setDropDownValue(label);
        // setMenuOptions(options);
      }
    });
  }, [options]);

  useEffect(() => {
    setDropDownValue(placeholder);
  }, [placeholder]);

  // useEffect(() => {
  //   if (options.length === 0 && dispatch && listApi) {
  //     apiCall()
  //   }
  // }, [menuOptions])

  return (
    <div
      className={
        "drop-down-main" +
        (size === "small"
          ? " drop-down-main-small"
          : size === "medium"
          ? " drop-down-main-medium"
          : size === "mini"
          ? " drop-down-main-mini"
          : " drop-down-main-large")
      }
    >
      {dropDownTitle && (
        <div
          className={
            "drop-down-title" +
            (animateDropDownTitle
              ? dropDownValueTwo || showMenu
                ? " animateDropDownLabel animateDropDownLabelUp"
                : " animateDropDownLabel"
              : "")
          }
          style={
            animateDropDownTitle ? { padding: "0", ...titleStyle } : titleStyle
          }
        >
          <span>{dropDownTitle ? dropDownTitle : ""}</span>
        </div>
      )}

      <div
        className={
          "drop-down-selector" +
          (disabled
            ? ""
            : menuOptions?.length > 4 ||
              (showSearchBar && menuOptions?.length > 3)
            ? " show-drop-scroll"
            : " hide-drop-scroll")
        }
      >
        <div
          className={disabled ? " direct disabledDropBox" : "direct"}
          onClick={() => {
            if (!disabled) {
              handleClick();
            }
          }}
          style={customDropBoxStyles ? customDropBoxStyles : {}}
        >
          <div className="default_value" style={customTextStyle}>
            {dropDownValue || "\u00A0"}
          </div>
          <svg
            className={`drop-arrow ${
              disabled ? "disabledDropBox" : addStyle ? "up-arrow" : ""
            }`}
            style={
              customTextStyle && dropDownValue === placeholder
                ? customTextStyle
                : {}
            }
            xmlns="http://www.w3.org/2000/svg"
            height="1rem"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#415094"
          >
            <path d="M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z" />
          </svg>
        </div>
        {showMenu && (
          <DropDownMenu
            disabled={disabled}
            addStyle={addStyle}
            showSearchBar={showSearchBar}
            dropDownValueTwo={dropDownValueTwo}
            resetButton={resetButton}
            menuOptions={menuOptions}
            setDropDownValue={setDropDownValue}
            setDropDownValueTwo={setDropDownValueTwo}
            options={options}
            setMenuOptions={setMenuOptions}
            showMenu={showMenu}
            handleClick={handleClick}
            dispatch={dispatch}
            listApi={listApi}
            handleResetBtnText={handleResetBtnText}
          />
        )}
      </div>
    </div>
  );
};

export default DropDownBox;

const DropDownMenu = ({
  options,
  disabled,
  addStyle,
  showSearchBar,
  dropDownValueTwo,
  resetButton,
  menuOptions,
  setDropDownValue,
  setDropDownValueTwo,
  setMenuOptions,
  showMenu,
  handleClick,
  listApi,
  dispatch,
  handleResetBtnText,
}) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    // formik.setFieldValue("search", e.target.value.toLowerCase())
  };

  useEffect(() => {
    if (showSearchBar) {
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
  }, []);

  useEffect(() => {
    if (options) {
      setMenuOptions(options);
    }
  }, [options]);

  return (
    <>
      {disabled ? (
        ""
      ) : showMenu ? (
        <div
          className={
            addStyle ? "drop-down-menu" : "drop-down-menu hide_drop-down-menu"
          }
          ref={showMenu && globalClick ? menuRef : null}
        >
          {showSearchBar ? (
            <div className="drop-down-search-bar">
              <input
                type="text"
                placeholder="search here..."
                name="search"
                value={search}
                onChange={handleSearch}
                maxLength={80}
              />
            </div>
          ) : null}

          {resetButton && dropDownValueTwo && !search ? (
            <div
              className="drop-down-item"
              onClick={() => {
                setDropDownValue(handleResetBtnText());
                setDropDownValueTwo("");
                handleClick();
              }}
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
              >
                <span>{label}</span>
              </div>
            ))
          ) : (
            <div className="drop-down-item">
              <span>No Data Found</span>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};
