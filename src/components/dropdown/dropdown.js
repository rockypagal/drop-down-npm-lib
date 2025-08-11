/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  cssSizeList,
  defaultValueCSS,
  direct,
  dropArrowCSS,
  dropdownMainCSS,
  dropdownSelector,
  dropdownTitleCSS,
  errors,
  keys,
  onOpenInitialValue,
} from "../../constant/constant";
import {
  checkIsValidValue,
  checkType,
  filterLabelAndValues,
  focusTheMain,
  handleLog,
  handleSetValidValue,
  isValidCSSUnit,
  multiSelectSetter,
  resetOptionsList,
  trim,
} from "../../helper/helper";
import { useChangeObserverHandler } from "../../hooks/DropdownSelector/changeObserverHook";
import { useDropdownSelectionEffect } from "../../hooks/DropdownSelector/dropdownValueSelectHook";
import "./dropdown-style.css";
import { DropDownMenu } from "./DropDownMenu";
import { MultiSelect } from "../multiselect/multiSelect";
const DropDownBox = ({
  title,
  animateTitle,
  options,
  placeholder,
  width: size,
  showSearch,
  disabled = false,
  incomingValue,
  incomingMultiSelectValues,
  resetButton,
  onSelect,
  beforeSelect,
  afterSelect,
  changeObserver = {},
  customArrow,
  styles = {},
  hideScrollbar = false,
  loading = false,
  noDataMessage = "No Data Found",
  onOpen,
  onClose,
  scrollListenerTarget,
  dynamicPositioning,
  multiSelect = false,
  showMultiRemoveBtn,
  multiSelectLimit,
  closeOnSelect = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const [addStyle, setAddStyle] = useState(false);
  const [menuOptions, setMenuOptions] = useState(options);

  const [dropDownValue, setDropDownValue] = useState(placeholder);
  const [dropDownValueTwo, setDropDownValueTwo] = useState("");
  const [historyIncomingValue, setHistoryIncomingValue] = useState("");
  const mainRef = React.useRef(null);
  let onOpenFlag = useRef(null);
  let contextCollectionRef = useRef(null);

  const timerId = useRef(null);
  const handleClick = () => {
    setAddStyle((oldValue) => !oldValue);
    // DropBoxVisibility();
  };

  useEffect(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }

    if (addStyle) {
      // Show immediately
      setShowMenu(true);
      onOpenFlag.current = true;
    } else {
      // Delay hiding
      timerId.current = setTimeout(() => {
        setShowMenu(false);
      }, 200);
    }

    return () => {
      // Always clear any pending timeout on cleanup
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
    };
  }, [addStyle]);
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
    const { isValid, validValue } = checkIsValidValue(value, key);

    let beforeSelectCheck;
    let detailsObj = {
      oldValue: handleSetValidValue(dropDownValueTwo),
      index,
      row: {
        ...row,
        label:
          key && (key === keys?.resetKey || key === keys?.globalResetKey)
            ? ""
            : row?.label,
      },
      ...(key ? { triggeredBy: key } : { triggeredBy: keys?.triggeredByKey }),
    };
    if (beforeSelect && checkType(beforeSelect, "function")) {
      beforeSelectCheck = beforeSelect(value, detailsObj);
    }
    if (beforeSelectCheck !== false && (label || value)) {
      // setDropDownValue(label);
      // setDropDownValueTwo(validValue);

      setDropDownValue((oldValue) => {
        let newValue;
        if (
          multiSelect &&
          (key === keys.changeObserverMultiSelect ||
            key === keys.incomingValueMultiSelect)
        ) {
          return label;
        }
        if (multiSelect) {
          if (Array.isArray(oldValue) && oldValue.includes(label)) {
            newValue = filterLabelAndValues(oldValue, undefined, label);
          } else if (
            Array.isArray(oldValue) &&
            Number(multiSelectLimit) === oldValue?.length &&
            key !== keys?.resetKey
          ) {
            newValue = oldValue;
          } else {
            newValue =
              key === keys?.resetKey
                ? placeholder || ""
                : Array.isArray(oldValue)
                ? [...oldValue, label]
                : [label];
          }
        } else {
          newValue = label;
        }
        return newValue;
      });

      setDropDownValueTwo((oldValue) => {
        let newValue;
        if (
          multiSelect &&
          (key === keys.changeObserverMultiSelect ||
            key === keys.incomingValueMultiSelect)
        ) {
          return value;
        }
        if (multiSelect) {
          if (Array.isArray(oldValue) && oldValue.includes(value)) {
            newValue = filterLabelAndValues(oldValue, undefined, value);
          } else if (
            Array.isArray(oldValue) &&
            Number(multiSelectLimit) === oldValue?.length &&
            key !== keys?.resetKey
          ) {
            handleLog?.({
              logType: "error",
              message: errors?.multiSelectLimit,
            });

            newValue = oldValue;
          } else {
            newValue =
              key === keys?.resetKey
                ? []
                : Array.isArray(oldValue)
                ? [...oldValue, value]
                : [value];
          }
        } else {
          newValue = validValue;
        }
        return newValue;
      });
    }

    contextCollectionRef.current = {
      ...detailsObj,
      validSelectedValue: { isValid, validValue },
    };

    if (isSearched) {
      setTimeout(() => {
        if (optionsLength >= 100) {
          setMenuOptions(options?.slice(0, 100));
        } else {
          setMenuOptions(options);
        }
      }, 250);
    } else {
      resetOptionsList({ options, setMenuOptions });
    }

    if (
      ![
        keys?.changeObserverKey,
        keys?.globalResetKey,
        keys?.incomingValueKey,
        keys?.changeObserverMultiSelect,
      ].includes(key) &&
      closeOnSelect
    ) {
      handleClick();
    }
  }

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

  //Custom Hook for DropDown Selection

  useDropdownSelectionEffect({
    dropDownValue,
    dropDownValueTwo,
    placeholder,
    onSelect,
    afterSelect,
    beforeSelect,
    contextCollectionRef,
    handleResetBtnText,
    setDropDownValue,
  });

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

  // useEffect(() => {
  //   if (
  //     incomingValue &&
  //     historyIncomingValue !== incomingValue &&
  //     !dropDownValueTwo
  //   ) {
  //     let index = null;
  //     const result = options?.find((item, i) => {
  //       if (item?.value === incomingValue) {
  //         index = i;
  //         return true;
  //       }
  //       return false;
  //     });

  //     if (result?.value === incomingValue) {
  //       setHistoryIncomingValue(result?.value);
  //       handleSetValues({ ...result, key: keys?.incomingValueKey }, index);
  //     }
  //   }
  // }, [incomingValue, memoizedOptions]);

  // Incoming value logic

  useEffect(() => {
    const shouldApplyIncomingValue =
      incomingValue !== undefined &&
      incomingValue !== historyIncomingValue &&
      !dropDownValueTwo;

    if (!shouldApplyIncomingValue) return;

    const index = options?.findIndex((item) => item?.value === incomingValue);
    const result = index !== -1 ? options?.[index] : null;

    if (result) {
      setHistoryIncomingValue(result.value);
      handleSetValues({ ...result, key: keys?.incomingValueKey }, index);
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

  //Custom Hook for ChangeObserver

  useEffect(() => {
    if (
      onClose &&
      checkType(onClose, "function") &&
      !showMenu &&
      onOpenFlag.current
    ) {
      onClose(dropDownValueTwo, {
        ...(contextCollectionRef.current || onOpenInitialValue),
        triggeredBy: "onClose",
      });
    }
  }, [showMenu]);

  const memoizedIncomingMultiVal = useMemo(
    () => incomingMultiSelectValues,
    [incomingMultiSelectValues]
  );

  useEffect(() => {
    if (
      Array.isArray(memoizedIncomingMultiVal) &&
      memoizedIncomingMultiVal.length &&
      !dropDownValueTwo?.length
    ) {
      const { labels, values } = multiSelectSetter({
        memoizedIncomingMultiVal,
        multiSelectLimit,
        options,
      });

      handleSetValues(
        {
          label: labels,
          value: values,
          key: keys?.incomingValueMultiSelect,
        },
        null
      );
    }
  }, [memoizedIncomingMultiVal]);
  useChangeObserverHandler({
    changeObserver,
    dropDownValue,
    dropDownValueTwo,
    placeholder,
    handleResetBtnText,
    options,
    handleSetValues,
    multiSelect,
    multiSelectLimit,
    setDropDownValue,
    setDropDownValueTwo,
  });
  console.log("dropDownValue: ", dropDownValue);
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
        ...dropdownMainCSS,
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
          onClick={() => {
            if (!disabled && showMenu) {
              handleClick();
              // resetOptionsList({ options, setMenuOptions });
            }
          }}
          style={{
            ...{
              dropdownTitleCSS,
              background: animateTitle ? "white" : "transparent",
            },
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
              (menuOptions?.length > 8 ||
                (showSearch && menuOptions?.length > 7))
            ? " show-drop-scroll"
            : " hide-drop-scroll")
        }
        style={{ ...dropdownSelector }}
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
              resetOptionsList({ options, setMenuOptions });
              if (loading && !showMenu) {
                focusTheMain(mainRef);
              }
            }
          }}
          style={{
            ...direct,
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
              ...defaultValueCSS,
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
            {/* {dropDownValue === handleResetBtnText() && dropDownValueTwo === ""
              ? "\u00A0"
              : dropDownValue || "\u00A0"} */}

            {dropDownValue === handleResetBtnText() &&
            dropDownValueTwo === "" ? (
              "\u00A0"
            ) : multiSelect &&
              Array.isArray(dropDownValue) &&
              Array.isArray(dropDownValueTwo) ? (
              <MultiSelect
                dropDownValue={dropDownValue}
                dropDownValueTwo={dropDownValueTwo}
                setDropDownValue={setDropDownValue}
                setDropDownValueTwo={setDropDownValueTwo}
                showMultiRemoveBtn={showMultiRemoveBtn}
                multiSelectLimit={multiSelectLimit}
                handleResetBtnText={handleResetBtnText}
              />
            ) : (
              dropDownValue || "\u00A0"
            )}
          </div>
          {loading ? (
            <div className="dropdown-direct-loading">
              <span className="loading__dot"></span>
              <span className="loading__dot"></span>
              <span className="loading__dot"></span>
            </div>
          ) : customArrow && customArrow?.element ? (
            <div
              // className={`drop-arrow ${addStyle ? "up-arrow" : ""}`}
              className={`drop-arrow custom-arrow-style ${
                addStyle ? "up-arrow" : ""
              } ${checkType(styles?.arrow, "string") ? styles?.arrow : ""}`}
              style={checkType(styles?.arrow, "object", {
                ifTrue: styles?.arrow,
                ifFalse: {},
              })}
            >
              {customArrow?.element}
            </div>
          ) : (
            // <svg
            //   className={`drop-arrow ${addStyle ? "up-arrow" : ""} ${
            //     checkType(styles?.arrow, "string") ? styles?.arrow : ""
            //   }`}
            //   style={{
            //     ...dropArrowCSS,
            //     ...(checkType(styles?.arrow, "object") ? styles?.arrow : {}),
            //   }}
            //   xmlns="http://www.w3.org/2000/svg"
            //   height="1rem"
            //   viewBox="0 -960 960 960"
            //   width="24px"
            //   //fill="#415094"
            //   fill="black"
            // >
            //   <path d="M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z" />
            // </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
              height="20px"
              className={`drop-arrow ${addStyle ? "up-arrow" : ""} ${
                checkType(styles?.arrow, "string") ? styles?.arrow : ""
              }`}
              style={{
                ...dropArrowCSS,
                ...(checkType(styles?.arrow, "object") ? styles?.arrow : {}),
              }}
              fill="gray"
            >
              <g transform="scale(1.6) translate(-4.5, -4.5)">
                <path
                  d="M12 15a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L12 12.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4A1 1 0 0 1 12 15z"
                  // style={{ fill: "dodgerblue" }}
                />
              </g>
            </svg>
          )}
        </div>
        <div
          className="focus-element"
          style={{ outline: "none" }}
          tabIndex={showMenu ? "-1" : "0"}
          onKeyDown={(e) => {
            if (
              (e.key === "Enter" && !showMenu) ||
              (e.key === "Tab" && showMenu)
            ) {
              e.key === "Tab" && showMenu && e.preventDefault();
              handleClick();
              // resetOptionsList({ options, setMenuOptions });
            }
          }}
        />
        {showMenu &&
          createPortal(
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
              loading={loading}
              noDataMessage={noDataMessage}
              titlePosition={title && !animateTitle}
              onOpen={onOpen}
              scrollListenerTarget={scrollListenerTarget}
              dynamicPositioning={dynamicPositioning}
              contextCollectionRef={contextCollectionRef}
              multiSelectLimit={multiSelectLimit}
              multiSelect={multiSelect}
              scrollbarClass={
                disabled
                  ? ""
                  : !hideScrollbar &&
                    (menuOptions?.length > 8 ||
                      (showSearch && menuOptions?.length > 7))
                  ? " show-drop-scroll"
                  : " hide-drop-scroll"
              }
            />,
            dynamicPositioning ? document.body : mainRef.current
          )}
      </div>
    </div>
  );
};

export default memo(DropDownBox);
DropDownBox.displayName = "DropDownBox by ru";
