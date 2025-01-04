/* eslint-disable react-hooks/exhaustive-deps */
import "./dropdown-style.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DropDownMenu } from "./DropDownMenu";
const DropDownBox = ({
  title, // ? provide string to show label for drop down
  animateTitle, // ? this is boolean value which allow this title to animate on focus or if use select any value
  options, // ? here provide array [{label:"America",value:"america"}] component will use this data to show options and set value on onclick
  placeholder, // ? provide string to show placeholder for drop down it can be use stand alone or with title
  size, // ? provide the values in string as "small","medium","large", or "mini" to set predefine sizes for drop down
  showSearch, // ? provide boolean to show search bar in drop down
  // setter, // ? provide set function of useState or formik.setFieldValue to get selected value
  disabled = false, // ? provide boolean to disable drop down
  incomingValue, // ? provide incoming string value which will be set on render
  resetButton, // ? provide boolean or string to show reset button clear selected value
  onSelect, // ? provide formik.setValue
  beforeSelect,
  afterSelect,
  changeObserver = {},
  customArrow, //? provide jsx or svg to replace the default down arrow
  styles = {
    selectStyles: false, // ? provide styles in object to style the select box
    selectValueStyle: false, // ? provide styles to style text in drop down
    placeholderStyle: false, //? provide styles in object to style the Placeholder
    titleStyle: {}, //? provide styles in object to style the title
    arrowStyle: {}, //? provide styles in object to style the arrow svg
    disableStyle: {}, //? provide styles in object to style dropdown in disable state
    optionsBoxStyle: {}, //? provide styles in object to style options box
    optionsStyle: {}, //? provide styles in object to style options box
    searchBoxStyle: {}, //? provide styles in object to style the input box for search
  },
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [addStyle, setAddStyle] = useState(false);
  const [menuOptions, setMenuOptions] = useState(options);
  const [dropDownValue, setDropDownValue] = useState(placeholder);
  const [dropDownValueTwo, setDropDownValueTwo] = useState("");
  const [historyIncomingValue, setHistoryIncomingValue] = useState("");
  const [timerId, setTimerId] = useState(null);
  const mainRef = useRef(null);
  const handleClick = () => {
    setAddStyle(!addStyle);
    // formik.setFieldValue("search", "")
    DropBoxVisibility();
  };
  //
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

  // ? function to set reset button value
  const handleResetBtnText = () => {
    return typeof resetButton === "string" ? resetButton : "Reset";
  };

  function handlePlaceholderAndSelectedValueStyle() {
    // if (
    //   styles?.selectValueStyle &&
    //   placeholder &&
    //   styles?.placeholderStyle &&
    //   !dropDownValueTwo
    // ) {
    //   return { ...styles?.selectValueStyle, ...styles?.placeholderStyle };
    // } else
    if (placeholder && styles?.placeholderStyle && !dropDownValueTwo) {
      return styles?.placeholderStyle;
    } else if (styles?.selectValueStyle) {
      return styles?.selectValueStyle;
    } else {
      return {};
    }
  }

  function handleSetValues(label, value) {
    let temp;

    if (beforeSelect && typeof beforeSelect === "function") {
      temp = beforeSelect(value, dropDownValueTwo);
    }
    if (temp !== false && (label || value)) {
      setDropDownValue(label);
      setDropDownValueTwo(value);
    }
    handleClick();
  }

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  //? useEffect to handle the setValue to the onSelect

  useEffect(() => {
    const isReset = dropDownValue === handleResetBtnText();

    if (dropDownValueTwo || dropDownValue === handleResetBtnText()) {
      if (!onSelect) {
        console.error(
          "Dropdown component requires a callback function to handle value changes. Please provide a valid 'onSelect' prop."
        );
      } else if ((onSelect && dropDownValueTwo) || (onSelect && isReset)) {
        onSelect(dropDownValueTwo);
      }

      if (afterSelect && typeof afterSelect === "function") {
        afterSelect(dropDownValueTwo);
      }

      if (dropDownValue === handleResetBtnText()) {
        //  else if (setter || (setter && isReset)) {
        //   setter(dropDownValueTwo);
        // }
        setDropDownValue(placeholder ? placeholder : "");
      }
    }
  }, [dropDownValueTwo]);

  const memoizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    setMenuOptions(options);
  }, [memoizedOptions]);

  useEffect(() => {
    if (
      (historyIncomingValue && historyIncomingValue !== incomingValue) ||
      (!dropDownValueTwo && incomingValue)
    ) {
      const result = options?.find((item) => item?.value === incomingValue);
      if (result?.value === incomingValue) {
        setHistoryIncomingValue(result?.value);
        setDropDownValueTwo(result?.value);
        setDropDownValue(result?.label);
      }
    }
  }, [incomingValue, memoizedOptions]);

  useEffect(() => {
    if (disabled && showMenu) {
      handleClick();
    }
  }, [disabled]);

  let oldTargetedValue = useRef("");
  useEffect(() => {
    const { target, handler } = changeObserver;

    if (typeof handler === "function") {
      const setter = (value) => {
        let result = { label: value ? value : placeholder, value: value };

        if (value) {
          result = options?.find((item) => item?.value === value);
        }

        if (result?.value === value) {
          setDropDownValueTwo(result?.value);
          setDropDownValue(result?.label);
        }
      };

      handler(setter, {
        newTargetedValue: target,
        oldTargetedValue: oldTargetedValue.current,
        dropdownValue: dropDownValueTwo,
      });

      oldTargetedValue.current = target;
    }
  }, [changeObserver?.target]);

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
      ref={mainRef}
    >
      {title && (
        <div
          className={
            "drop-down-title" +
            (animateTitle
              ? dropDownValueTwo || showMenu
                ? " animateDropDownLabel animateDropDownLabelUp"
                : " animateDropDownLabel"
              : "")
          }
          style={
            animateTitle
              ? {
                  ...styles?.titleStyle,
                  padding: "0px !important",
                  margin: "0px !important",
                }
              : styles?.titleStyle
          }
        >
          <span>{title ? title : ""}</span>
        </div>
      )}

      <div
        className={
          "drop-down-selector" +
          (disabled
            ? ""
            : menuOptions?.length > 4 || (showSearch && menuOptions?.length > 3)
            ? " show-drop-scroll"
            : " hide-drop-scroll")
        }
      >
        <div
          className={disabled ? " direct disabledDropBox" : "direct"}
          onClick={(e) => {
            if (!disabled) {
              handleClick();
            }
          }}
          style={
            styles?.selectStyles && disabled && styles?.disableStyle
              ? { ...styles?.selectStyles, ...styles?.disableStyle }
              : disabled && styles?.disableStyle
              ? { ...styles?.disableStyle }
              : styles?.selectStyles
              ? { ...styles?.selectStyles }
              : {}
          }
        >
          <div
            className="default_value"
            style={handlePlaceholderAndSelectedValueStyle()}
          >
            {dropDownValue || "\u00A0"}
          </div>
          {customArrow && customArrow?.element ? (
            <div
            // className={`drop-arrow ${
            //   disabled ? "disabledDropBox" : addStyle ? "up-arrow" : ""
            // }`}
            >
              {customArrow?.element}
            </div>
          ) : (
            <svg
              className={`drop-arrow ${addStyle ? "up-arrow" : ""}`}
              // style={
              //   styles?.selectValueStyle && dropDownValue === placeholder
              //     ? styles?.selectValueStyle
              //     : {}
              // }
              style={styles?.arrowStyle}
              xmlns="http://www.w3.org/2000/svg"
              height="1rem"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#415094"
            >
              <path d="M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z" />
            </svg>
          )}
        </div>
        {showMenu && (
          <DropDownMenu
            disabled={disabled}
            addStyle={addStyle}
            searchBar={showSearch}
            dropDownValueTwo={dropDownValueTwo}
            resetButton={resetButton}
            menuOptions={menuOptions}
            setDropDownValue={setDropDownValue}
            setDropDownValueTwo={setDropDownValueTwo}
            options={options}
            setMenuOptions={setMenuOptions}
            showMenu={showMenu}
            handleClick={handleClick}
            handleResetBtnText={handleResetBtnText}
            optionsBoxStyle={styles?.optionsBoxStyle}
            optionsStyle={styles?.optionsStyle}
            inputSearchStyle={styles?.searchBoxStyle}
            incomingValue={incomingValue}
            mainRef={mainRef}
            animateTitle={animateTitle}
            handleSetValues={handleSetValues}
          />
        )}
      </div>
    </div>
  );
};

export default DropDownBox;
