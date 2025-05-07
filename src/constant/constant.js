export const keys = {
  resetKey: "Reset",
  globalKey: "globalClick",
  triggeredByKey: "onSelect",
  globalResetKey: "GlobalReset",
  incomingValueKey: "incomingValue",
  changeObserverKey: "changeObserver",
  changeObserverRefKey: "mpnxmaxQGA-DropDownBox-Ref-gNcFybupRk",
  incomingKey: "incomingValue",
};
export const cssSizeUnits = [
  "px", // Pixels
  "em", // Relative to the font-size of the element
  "rem", // Relative to the root element's font-size
  "%", // Percentage of the parent element
  "vw", // Viewport width
  "vmin", // Minimum of viewport width or height
  "vmax", // Maximum of viewport width or height
];
export const cssSizeList = ["small", "medium", "mini"];

export const dropdownMainCSS = {
  position: "relative",
};

export const dropdownSelector = {
  width: "100%",
  position: "relative",
};
export const direct = {
  boxSizing: "border-box",
  width: "100% !important",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  /* color: #415094, */
  color: "black",
  alignItems: "center",
  padding: "0.65rem",
  borderRadius: "0.3125rem",
  border: "1px solid #a1a4b9",
  userSelect: "none",
  backgroundColor: "white",
  overflow: "hidden",
};

export const defaultValueCSS = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const dropArrowCSS = {
  fontSize: "1rem",
  transition: "all 0.15s",
  color: "black",
  pointerEvents: "none",
};
export const dropdownTitleCSS = {
  padding: "0.5rem 0",
  fontWeight: "500",
  // background: "white",
};
export const errors = {
  onSelectRequired:
    "Dropdown component requires a callback function to handle value changes. Please provide a valid 'onSelect','beforeSelect' or 'afterSelect' prop.",
  provideValidValues:
    "Please provide valid dropdown values. This dropdown does not accept undefined and null.",
};

export const falsyValuesObj = {
  null: "null",
  false: "false",
  0: "0",
  undefined: "undefined",
  "": " ",
  NaN: "NaN",
};
export const truthyValuesObj = {
  null: null,
  false: false,
  0: 0,
  undefined: undefined,
  " ": "",
  NaN: NaN,
};
