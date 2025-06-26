import { useEffect } from "react";
import { checkType, handleLog, handleSetValidValue } from "../../helper/helper"; // Adjust path as needed
import { errors } from "../../constant/constant";

export const useDropdownSelectionEffect = ({
  dropDownValue,
  dropDownValueTwo,
  placeholder,
  onSelect,
  afterSelect,
  beforeSelect,
  contextCollectionRef,
  handleResetBtnText,
  setDropDownValue,
}) => {
  useEffect(() => {
    const resetButtonText = handleResetBtnText();
    const isReset =
      dropDownValue === resetButtonText && dropDownValueTwo === "";

    let validSelectedValue;
    if (contextCollectionRef.current) {
      validSelectedValue = contextCollectionRef.current.validSelectedValue;
      delete contextCollectionRef.current.validSelectedValue;
    }

    if (dropDownValueTwo || isReset) {
      const hasNoHandlers = !(onSelect || beforeSelect || afterSelect);

      if (hasNoHandlers) {
        handleLog?.({
          logType: "error",
          message: errors?.onSelectRequired,
        });
      } else {
        const valueToUse = validSelectedValue?.isValid
          ? dropDownValueTwo
          : handleSetValidValue(dropDownValueTwo);

        if (onSelect && (dropDownValueTwo || isReset)) {
          onSelect(valueToUse, contextCollectionRef.current);
        }

        if (checkType(afterSelect, "function")) {
          afterSelect(valueToUse, contextCollectionRef.current);
        }

        if (isReset) {
          setDropDownValue(placeholder || "");
        }
      }
    }

    // if (contextCollectionRef.current) {
    //   contextCollectionRef.current = null;
    // }
  }, [dropDownValueTwo]);
};

