import { useEffect, useMemo, useRef } from "react";
import { checkType } from "../../helper/helper"; // Adjust the path as needed
import { keys } from "../../constant/constant"; // Adjust path

export const useChangeObserverHandler = ({
  changeObserver,
  dropDownValue,
  dropDownValueTwo,
  placeholder,
  handleResetBtnText,
  options,
  handleSetValues,
}) => {
  const oldTargetedValue = useRef("");

  const target = useMemo(
    () => changeObserver?.target,
    [changeObserver?.target]
  );

  useEffect(() => {
    if (!changeObserver) return;

    const { handler } = changeObserver;

    // Skip internal changes
    if (oldTargetedValue.current === keys?.changeObserverRefKey) {
      oldTargetedValue.current = "";
      return;
    }

    if (!checkType(handler, "function")) return;

    const setter = (value) => {
      const isReset =
        (value === handleResetBtnText() || value === "") &&
        dropDownValueTwo !== "" &&
        dropDownValue !== placeholder;

      if (isReset) {
        handleSetValues({
          label: handleResetBtnText(),
          value: "",
          key: keys?.globalResetKey,
        });
        return;
      }

      let index = -1;
      const found = options?.find((item, i) => {
        if (item?.value === value) {
          index = i;
          return true;
        }
        return false;
      });

      if (found?.value === value) {
        handleSetValues({ ...found, key: keys?.changeObserverKey }, index);
      }

      return {
        success: !!found,
        row: found || null,
        index: index !== -1 ? index : null,
      };
    };

    handler(setter, {
      newTargetedValue: target,
      oldTargetedValue: oldTargetedValue.current,
      dropdownValue: dropDownValueTwo,
    });

    oldTargetedValue.current = target;
  }, [target]);
};
