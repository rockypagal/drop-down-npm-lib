// all the lagacy code is from 3.2.4

//? useEffect to handle the setValue to the onSelect
useEffect(() => {
  const resetButtonText = handleResetBtnText();
  const isReset = dropDownValue === resetButtonText && dropDownValueTwo === "";

  let validSelectedValue;
  if (contextCollectionRef.current) {
    validSelectedValue = contextCollectionRef.current.validSelectedValue;
    delete contextCollectionRef.current.validSelectedValue;
  }

  if (dropDownValueTwo || isReset) {
    if (!(onSelect || beforeSelect || afterSelect)) {
      handleLog({ logType: "error", message: errors?.onSelectRequired });
    } else if ((onSelect && dropDownValueTwo) || (onSelect && isReset)) {
      onSelect(
        validSelectedValue?.isValid
          ? dropDownValueTwo
          : handleSetValidValue(dropDownValueTwo),
        contextCollectionRef.current
      );
    }

    if (afterSelect && checkType(afterSelect, "function")) {
      afterSelect(
        validSelectedValue?.isValid
          ? dropDownValueTwo
          : handleSetValidValue(dropDownValueTwo),
        contextCollectionRef.current
      );
    }

    if (isReset) {
      setDropDownValue(placeholder || "");
    }
  }
  if (contextCollectionRef.current) {
    contextCollectionRef.current = null;
  }
}, [dropDownValueTwo]);
