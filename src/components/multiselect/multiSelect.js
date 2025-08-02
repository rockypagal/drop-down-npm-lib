import React from "react";
import { filterLabelAndValues } from "../../helper/helper";
export function MultiSelect({
  dropDownValue,
  dropDownValueTwo,
  setDropDownValue,
  setDropDownValueTwo,
  showMultiCloseBtn,
  multiSelectLimit,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: ".5rem",
        alignItems: "center",
      }}
    >
      {dropDownValue?.map((item, index) => {
        return (
          <div
            style={{
              fontSize: "12px",
              padding: ".1rem .3rem",
              border: "1px solid #3b82f6",
              borderRadius: "3px",
              display: "flex",
              gap: ".3rem",
              alignItems: "center",
              backgroundColor: "#dbedff",
            }}
            key={index}
          >
            <span>{item}</span>
            {showMultiCloseBtn && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const newLabels = filterLabelAndValues(
                    dropDownValue,
                    index,
                    item
                  );
                  const newValues = filterLabelAndValues(
                    dropDownValueTwo,
                    index,
                    item
                  );
                  setDropDownValue(newLabels);
                  setDropDownValueTwo(newValues);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="10px"
                  viewBox="0 -960 960 960"
                  width="10px"
                  fill="black"
                  className="remove"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
