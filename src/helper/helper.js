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
  mainRef.current.lastChild.lastChild.focus();
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
