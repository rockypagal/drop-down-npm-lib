/* eslint-disable react-hooks/exhaustive-deps */
import "./dropdown-style.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DropDownMenu } from "./DropDownMenu";
import { cssSizeList, cssSizeUnits } from "../../constant/constant";
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

  function handleSetValues(row = {}, index = null, optionsLength, isSearched) {
    const { label, value, isReset = false } = row;
    if (row?.isReset) {
      delete row?.isReset;
    }
    if (label === undefined && value === undefined && showMenu) {
      handleClick();
      return;
    }
    let beforeSelectCheck;
    let detailsObj = {
      oldValue: dropDownValueTwo,
      index,
      row: { ...row, label: isReset ? "" : row?.label },
    };
    if (beforeSelect && typeof beforeSelect === "function") {
      beforeSelectCheck = beforeSelect(value, detailsObj);
    }
    if (beforeSelectCheck !== false && (label || value)) {
      setDropDownValue(label);
      setDropDownValueTwo(value);
    }

    contextCollectionRef.current = detailsObj;

    if (isSearched) {
      setTimeout(() => {
        if (optionsLength >= 500) {
          setMenuOptions(options?.slice(0, 500));
        } else {
          setMenuOptions(options);
        }
      }, 250);
    }

    if (showMenu) handleClick();
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
    const isReset =
      dropDownValue === resetButtonText && dropDownValueTwo === ""; //*********

    if (dropDownValueTwo || isReset) {
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

      if (isReset) {
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
      let index = null;
      const result = options?.find((item, i) => {
        //*********
        if (item?.value === incomingValue) {
          index = i;
          return true;
        }
        return false;
      });

      if (result?.value === incomingValue) {
        setHistoryIncomingValue(result?.value);
        handleSetValues(result, index);
      }
    }
  }, [incomingValue, memoizedOptions]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (disabled && showMenu) {
        handleClick();
      }
    }, 250);

    return () => clearTimeout(id);
  }, [disabled, showMenu]);

  useEffect(() => {
    const { target, handler } = changeObserver;

    if (typeof handler === "function") {
      const setter = (value) => {
        //*********
        let result = { label: value ? value : placeholder, value: value };
        let index = null;
        if (value) {
          result = options?.find((item, i) => {
            if (item?.value === value) {
              index = i;
              return true;
            }
            return false;
          });
        }

        if (result?.value === value) {
          handleSetValues(result, index);
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
    if (dropDownValue && !placeholder) {
      setDropDownValue("");
      return;
    }

    if (placeholder) {
      if (dropDownValueTwo) {
        setDropDownValueTwo("");
      }

      setDropDownValue(placeholder);
    }
  }, [placeholder]);

  function isValidCSSUnit(size) {
    const unit = size?.replaceAll(/\d/g, ""); //*********
    const isValidUnit = cssSizeUnits.includes(unit);
    if (isValidUnit) {
      return isValidUnit;
    }
    // console.error(
    //   `Invalid CSS unit: ${size}. Only the following units are supported by this component: px, em, rem, %, vw, vmin, vmax.`
    // );
    return false;
  }

  return (
    <div
      className={`drop-down-main ${
        typeof size === "string" && cssSizeList.includes(size)
          ? `drop-down-main-${size}`
          : "drop-down-main-large"
      }`}
      ref={mainRef}
      style={{
        ...(size && typeof parseInt(size) === "number"
          ? {
              width: isValidCSSUnit(size) ? size : `${parseInt(size)}px`,
            }
          : styles?.selectStyles?.width && {
              width: styles?.selectStyles?.width,
            }),
      }}
    >
      {title && (
        <div
          className={
            `drop-down-title animateDropDownLabel ${
              //*********
              animateTitle && (dropDownValueTwo || showMenu)
                ? "animateDropDownLabelUp"
                : ""
            }`

            // "drop-down-title" +
            // (animateTitle
            //   ? dropDownValueTwo || showMenu
            //     ? " animateDropDownLabel animateDropDownLabelUp"
            //     : " animateDropDownLabel"
            //   : "")
          }
          style={{
            ...styles?.titleStyle,
            ...(animateTitle && { padding: "0px" }),
            ...(animateTitle && { margin: "0px" }),
          }}
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
          className={`direct ${disabled ? "disabledDropBox" : ""}`} //*********
          onClick={(e) => {
            if (!disabled) {
              handleClick();
            }
          }}
          style={{
            ...(styles?.selectStyles && {
              ...styles?.selectStyles,
              ...(size && { width: "auto" }),
              ...(disabled &&
                !styles?.disableStyle && {
                  backgroundColor: "#e2e2e24b",
                  cursor: "not-allowed",
                }),
            }),
            ...(disabled &&
              styles?.disableStyle && {
                ...styles?.disableStyle,
              }),
          }}
        >
          <div
            className="default_value"
            style={{
              ...(styles?.selectValueStyle && styles?.selectValueStyle),
              ...(placeholder &&
                styles?.placeholderStyle &&
                !dropDownValueTwo &&
                styles?.placeholderStyle),
            }}
          >
            {dropDownValue === handleResetBtnText() && dropDownValueTwo === "" //*********
              ? "\u00A0"
              : dropDownValue || "\u00A0"}
          </div>
          {customArrow && customArrow?.element ? (
            <div
              className={`drop-arrow ${addStyle ? "up-arrow" : ""}`}
              style={styles?.arrowStyle}
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
