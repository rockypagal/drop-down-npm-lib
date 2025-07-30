import {
  cssSizeUnits,
  falsyValuesObj,
  keys,
  truthyValuesObj,
} from "../constant/constant";

export const checkType = (value, type, returnCustom = null) => {
  if (returnCustom) {
    return typeof value === type ? returnCustom?.ifTrue : returnCustom?.ifFalse;
  }
  return typeof value === type;
};

export function isValidCSSUnit(size) {
  const unit = size?.replaceAll(/\d/g, "");
  const isValidUnit = cssSizeUnits.includes(unit);
  if (isValidUnit) {
    return isValidUnit;
  }
  // console.error(
  //   `Invalid CSS unit: ${size}. Only the following units are supported by this component: px, em, rem, %, vw, vmin, vmax.`
  // );
  return false;
}

export const trim = (str) => str.trim().replace(/\s+/g, " ");

export const resetOptionsList = ({ options, setMenuOptions, delay = 250 }) => {
  setTimeout(() => {
    if (options?.length >= 100) {
      setMenuOptions(options?.slice(0, 100));
    } else {
      setMenuOptions(options);
    }
  }, delay);
};

export const focusTheMain = (mainRef) => {
  // mainRef.current.lastChild.lastChild.focus();
  mainRef.current.children[0].lastChild.focus();
};

export const checkIsValidValue = (value, key) => {
  if (key && (key === keys?.resetKey || key === keys?.globalResetKey)) {
    return { isValid: true, validValue: value };
  } else if ([null, false, undefined, "", 0, NaN].includes(value)) {
    return { isValid: false, validValue: falsyValuesObj[value] };
  }
  return { isValid: true, validValue: value };
};

export const handleSetValidValue = (value) => {
  return Object.values(falsyValuesObj).includes(value)
    ? truthyValuesObj[value]
    : value;
};
// export const checkIsValidValue = (value) => {
//   if (value !== undefined && value !== null) {
//     return true;
//   } else {
//     handleLog({ logType: "error", message: errors?.provideValidValues });
//     return false;
//   }
// };

export const handleLog = ({ logType, message }) => {
  console[logType](message);
};

export function handleKeyDown({
  handleSetValues,
  mainRef,
  options,
  setMenuOptions,
  search,
  menuOptions,
  resetButton,
  dropDownValueTwo,
  searchBar,
  inputRef,
  e,
  index,
  row,
  setItemIndex,
}) {
  if (["Tab", "Enter", "ArrowDown", "ArrowUp"].includes(e.key)) {
    e.preventDefault();
  }
  if (e.key === "Tab") {
    handleSetValues({ key: keys?.globalKey });
    focusTheMain(mainRef);
    resetOptionsList({ options, setMenuOptions });
  } else if (e.key === "Enter") {
    handleSetValues(
      row,
      index, // ***********
      options?.length,
      search?.query && search?.touched
    );
    focusTheMain(mainRef);
  } else if (e.key === "ArrowDown") {
    if (index < menuOptions?.length - 1) {
      // e.target.nextElementSibling.focus();
      setItemIndex(index + 1);
    }
  } else if (
    e.key === "ArrowUp" &&
    (index > 0 || (resetButton && dropDownValueTwo && !search.query))
  ) {
    e.target.previousElementSibling.focus();
  } else if (searchBar) {
    // setSearch({ query: e.key, touched: true });
    inputRef?.current?.focus();
  }
}

//*** function for searchAndDebounce */

export const getSearchOption = (option) => {
  if (!option?.searchOptions && checkType(option?.label, "string")) {
    return option?.label.replaceAll(" ", "")?.toLowerCase();
  }

  return (option?.searchOptions?.join("") + option?.label)
    .replaceAll(" ", "")
    ?.toLowerCase();
};

//** Function to create options from array of objects*/

const getValueByPath = (obj, path) =>
  path.reduce((acc, key) => (acc ? acc[key] : undefined), obj);

export function createOptions(arr, keyPaths) {
  return arr
    .map((item) => ({
      label: getValueByPath(item, keyPaths.labelPath),
      value: getValueByPath(item, keyPaths.valuePath),
    }))
    .filter((item) => item?.label !== undefined && item?.value !== undefined);
}

//**  */

export const checkIsConvertedValue = (value) => {
  if (["null", "false", "undefined", " ", "0", "NaN"].includes(value)) {
    return { isConverted: true, validValue: handleSetValidValue(value) };
  }

  return { isConverted: false, validValue: value };
};
