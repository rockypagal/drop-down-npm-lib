/* eslint-disable react-hooks/exhaustive-deps */
import "./dropdown-style.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DropDownMenu } from "./DropDownMenu";
const DropDownBox = ({
  title,
  animateTitle,
  options,
  placeholder,
  size,
  showSearch,
  disabled = false,
  incomingValue,
  resetButton,
  onSelect,
  beforeSelect,
  afterSelect,
  changeObserver = {},
  customArrow,
  styles = {},
  hideScrollbar = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [addStyle, setAddStyle] = useState(false);
  const [menuOptions, setMenuOptions] = useState(options);
  const [dropDownValue, setDropDownValue] = useState(placeholder);
  const [dropDownValueTwo, setDropDownValueTwo] = useState("");
  const [historyIncomingValue, setHistoryIncomingValue] = useState("");
  const [timerId, setTimerId] = useState(null);
  const mainRef = useRef(null);
  let oldTargetedValue = useRef("");
  let contextCollectionRef = useRef(null);

  const handleClick = () => {
    setAddStyle(!addStyle);
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

  // ? function to set reset button value
  const handleResetBtnText = () => {
    return typeof resetButton === "string" ? resetButton : "Reset";
  };

  function handlePlaceholderAndSelectedValueStyle() {
    if (placeholder && styles?.placeholderStyle && !dropDownValueTwo) {
      return styles?.placeholderStyle;
    } else if (styles?.selectValueStyle) {
      return styles?.selectValueStyle;
    } else {
      return {};
    }
  }
  function handleSetValues(label, value, index = null, menuOptionsLength) {
    if (label === undefined && value === undefined) {
      handleClick();
      return;
    }
    let beforeSelectCheck;

    if (beforeSelect && typeof beforeSelect === "function") {
      beforeSelectCheck = beforeSelect(value, {
        oldValue: dropDownValueTwo,
        index,
        row: { label, value },
      });
    }
    if (beforeSelectCheck !== false && (label || value)) {
      setDropDownValue(label);
      setDropDownValueTwo(value);
    }

    contextCollectionRef.current = {
      oldValue: dropDownValueTwo,
      index,
      row: { label, value },
    };
    setTimeout(() => {
      if (menuOptionsLength >= 500) {
        setMenuOptions(options?.slice(0, 500));
      } else {
        setMenuOptions(options);
      }
    }, 250);
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
    const resetButtonText = handleResetBtnText();
    const isReset = dropDownValue === resetButtonText;

    if (dropDownValueTwo || dropDownValue === resetButtonText) {
      if (!onSelect) {
        console.error(
          "Dropdown component requires a callback function to handle value changes. Please provide a valid 'onSelect' prop."
        );
      } else if ((onSelect && dropDownValueTwo) || (onSelect && isReset)) {
        onSelect(dropDownValueTwo, contextCollectionRef.current);
      }

      if (afterSelect && typeof afterSelect === "function") {
        afterSelect(dropDownValueTwo, contextCollectionRef.current);
      }

      if (dropDownValue === resetButtonText) {
        //  else if (setter || (setter && isReset)) {
        //   setter(dropDownValueTwo);
        // }
        setDropDownValue(placeholder || "");
      }
    }
    if (contextCollectionRef.current) {
      contextCollectionRef.current = null;
    }
  }, [dropDownValueTwo]);

  const memoizedOptions = useMemo(() => {
    return options;
  }, [options]);

  useEffect(() => {
    let arr = memoizedOptions;
    if (memoizedOptions?.length > 500) {
      arr = memoizedOptions?.slice(0, 500);
    }
    setMenuOptions(arr);
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
  useEffect(() => {
    if (placeholder) {
      if (dropDownValueTwo) {
        setDropDownValueTwo("");
      }

      setDropDownValue(placeholder);
    }
  }, [placeholder]);

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
                  padding: "0px",
                  margin: "0px",
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
            : !hideScrollbar &&
              (menuOptions?.length > 4 ||
                (showSearch && menuOptions?.length > 3))
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
            <div className={`drop-arrow ${addStyle ? "up-arrow" : ""}`}>
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
            options={options}
            setMenuOptions={setMenuOptions}
            showMenu={showMenu}
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
