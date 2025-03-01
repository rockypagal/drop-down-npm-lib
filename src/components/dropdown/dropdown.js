/* eslint-disable react-hooks/exhaustive-deps */
import "./dropdown-style.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DropDownMenu } from "./DropDownMenu";
import { cssSizeList, keys } from "../../constant/constant";
import { checkType, isValidCSSUnit, trim } from "../../helper/helper";
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
    return checkType(resetButton, "string", {
      ifTrue: resetButton,
      ifFalse: keys?.resetKey,
    });
  };

  function handleSetValues(row = {}, index = null, optionsLength, isSearched) {
    const { label, value, key } = row;
    if (row?.key) delete row?.key;

    if (key === keys?.globalKey && showMenu) {
      handleClick();
      return;
    }
    let beforeSelectCheck;
    let detailsObj = {
      oldValue: dropDownValueTwo,
      index,
      row: {
        ...row,
        label:
          key && (key === keys?.resetKey || key === keys?.globalResetKey)
            ? ""
            : row?.label,
      },
    };
    if (beforeSelect && checkType(beforeSelect, "function")) {
      beforeSelectCheck = beforeSelect(value, detailsObj);
    }
    if (beforeSelectCheck !== false && (label || value)) {
      setDropDownValue(label);
      setDropDownValueTwo(value);
    }

    contextCollectionRef.current = detailsObj;

    if (isSearched) {
      setTimeout(() => {
        if (optionsLength >= 100) {
          setMenuOptions(options?.slice(0, 100));
        } else {
          setMenuOptions(options);
        }
      }, 250);
    }

    if (key !== keys?.incomingKey && key !== keys?.globalResetKey)
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
    const isReset =
      dropDownValue === resetButtonText && dropDownValueTwo === "";

    if (dropDownValueTwo || isReset) {
      if (!onSelect) {
        console.error(
          "Dropdown component requires a callback function to handle value changes. Please provide a valid 'onSelect' prop."
        );
      } else if ((onSelect && dropDownValueTwo) || (onSelect && isReset)) {
        onSelect(dropDownValueTwo, contextCollectionRef.current);
      }

      if (afterSelect && checkType(afterSelect, "function")) {
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
    if (memoizedOptions?.length > 100) {
      arr = memoizedOptions?.slice(0, 100);
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
        if (item?.value === incomingValue) {
          index = i;
          return true;
        }
        return false;
      });

      if (result?.value === incomingValue) {
        setHistoryIncomingValue(result?.value);
        handleSetValues({ ...result, key: keys?.incomingKey }, index);
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

    if (checkType(handler, "function")) {
      const setter = (value) => {
        if (value === "" || value === handleResetBtnText()) {
          handleSetValues({
            label: handleResetBtnText(),
            value: "",
            key: keys?.globalResetKey,
          });
          return;
        }

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
          handleSetValues({ ...result, key: keys?.incomingKey }, index);
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

  return (
    <div
      className={`drop-down-main ${
        checkType(size, "string") && cssSizeList.includes(size)
          ? `drop-down-main-${size}`
          : `drop-down-main-large ${
              checkType(size, "string") &&
              String(parseInt(size)) === "NaN" &&
              !isValidCSSUnit(size)
                ? size
                : ""
            }`
      }`}
      ref={mainRef}
      style={{
        ...(size &&
        checkType(parseInt(size), "number") &&
        String(parseInt(size)) !== "NaN"
          ? {
              width:
                checkType(size, "string") && isValidCSSUnit(size)
                  ? size
                  : `${parseInt(size)}px`,
            }
          : checkType(styles?.selectBox, "object") &&
            styles?.selectBox?.width && {
              width: styles?.selectBox?.width,
            }),
      }}
    >
      {title && (
        <div
          className={
            trim(`drop-down-title  ${
              animateTitle
                ? dropDownValueTwo || showMenu
                  ? " animateDropDownLabel animateDropDownLabelUp"
                  : " animateDropDownLabel"
                : ""
            }
            ${checkType(styles?.title, "string", {
              ifTrue: styles?.title,
              ifFalse: "",
            })}
            `)

            // "drop-down-title" +
            // (animateTitle
            //   ? dropDownValueTwo || showMenu
            //     ? " animateDropDownLabel animateDropDownLabelUp"
            //     : " animateDropDownLabel"
            //   : "")
          }
          style={{
            ...(styles?.title &&
              checkType(styles?.title, "object") &&
              styles?.title),
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
          className={trim(`direct ${
            disabled ? "disabledDropBox" : ""
          } ${checkType(styles?.selectBox, "string", {
            ifTrue: styles?.selectBox,
            ifFalse: "",
          })}
          ${
            disabled
              ? checkType(styles?.disabledState, "string", {
                  ifTrue: styles?.disabledState,
                  ifFalse: "",
                })
              : ""
          }`)}
          onClick={(e) => {
            if (!disabled) {
              handleClick();
            }
          }}
          style={{
            ...(checkType(styles?.selectBox, "object") &&
              styles?.selectBox && {
                ...styles?.selectBox,
                ...(size && { width: "auto" }),
                ...(disabled &&
                  !styles?.disabledState && {
                    backgroundColor: "#e2e2e24b",
                    cursor: "not-allowed",
                  }),
              }),
            ...(disabled &&
              styles?.disabledState &&
              checkType(styles?.disabledState, "object") && {
                ...styles?.disabledState,
              }),
          }}
        >
          <div
            className={trim(
              `default_value ${
                dropDownValueTwo &&
                checkType(styles?.selectedValue, "string", {
                  ifTrue: styles?.selectedValue,
                  ifFalse: "",
                })
              } ${
                !dropDownValueTwo && checkType(styles?.placeholder, "string")
                  ? styles?.placeholder
                  : ""
              }`
            )}
            style={{
              ...(styles?.selectedValue &&
                dropDownValueTwo &&
                checkType(styles?.selectedValue, "object") &&
                styles?.selectedValue),
              ...(placeholder &&
                styles?.placeholder &&
                checkType(styles?.placeholder, "object") &&
                !dropDownValueTwo &&
                styles?.placeholder),
            }}
          >
            {dropDownValue === handleResetBtnText() && dropDownValueTwo === ""
              ? "\u00A0"
              : dropDownValue || "\u00A0"}
          </div>
          {customArrow && customArrow?.element ? (
            <div
              // className={`drop-arrow ${addStyle ? "up-arrow" : ""}`}
              className={`drop-arrow ${addStyle ? "up-arrow" : ""} ${
                checkType(styles?.arrow, "string") ? styles?.arrow : ""
              }`}
              style={checkType(styles?.arrow, "object", {
                ifTrue: styles?.arrow,
                ifFalse: {},
              })}
            >
              {customArrow?.element}
            </div>
          ) : (
            <svg
              className={`drop-arrow ${addStyle ? "up-arrow" : ""} ${
                checkType(styles?.arrow, "string") ? styles?.arrow : ""
              }`}
              // style={
              //   styles?.selectedValue && dropDownValue === placeholder
              //     ? styles?.selectedValue
              //     : {}
              // }
              style={checkType(styles?.arrow, "object") ? styles?.arrow : {}}
              xmlns="http://www.w3.org/2000/svg"
              height="1rem"
              viewBox="0 -960 960 960"
              width="24px"
              //fill="#415094"
              fill="black"
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
            optionsContainer={styles?.optionsContainer}
            optionItemStyle={styles?.optionItem}
            inputSearchStyle={styles?.searchInput}
            selectedOptionItemStyle={styles?.selectedOptionItem}
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
