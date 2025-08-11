declare module "ru-react-dropdown-component" {
  import React, { CSSProperties } from "react";

  // export interface DropDownOption {
  //   label: string | React.ReactNode; // Label to display in the dropdown
  //   value: any; // Value associated with the option
  //   searchOptions?: string[]; // Array of strings used for search functionality
  // }
  export interface DropDownOption {
    label: string | React.ReactNode; // Label to display in the dropdown
    value: Exclude<undefined | null>; // Value cannot be undefined or null
    searchOptions?: string[]; // Array of strings used for search functionality
  }
  export interface DropDownBoxPropsTypes {
    /** The title to be displayed for the dropdown */
    title?: string;

    /** Enables animation for the title when focused or when a value is selected */
    animateTitle?: boolean;

    /** Array of options to be displayed in the dropdown */
    options: DropDownOption[];

    /** Placeholder text for the dropdown */
    placeholder?: string;

    /** To hide the scrollbar in menu */
    hideScrollbar?: boolean;

    /** To enable multi select */
    multiSelect?: boolean;

    /** To enable remove button on selected value */
    showMultiRemoveBtn?: boolean;

    /** To set limit on dropdown for selective values */
    multiSelectLimit?: number;

    /** to close the menu on select */
    closeOnSelect?: boolean;

    /** Size of the dropdown (e.g., "small", "large", "mini") */
    width?: "small" | "medium" | "mini" | string | number;

    /** To show custom not data found message on search */
    noDataMessage?: string;

    /** Enables the search bar within the dropdown */
    showSearch?:
      | boolean
      | {
          delay?: number | string;
          onSearch?: (value: any, options: DropDownOption[]) => void;
          placeholder?: string;
        };

    /** Function to set the selected value, e.g., useState or Formik setFieldValue */
    // setter?: (value: string | null) => void;

    /** Disables the dropdown if set to true */
    disabled?: boolean;

    /** Shows the loading animation if set to true */
    loading?: boolean;

    /** scrollablePatent adds eventListener to the parent of the Dropdown */

    dynamicPositioning?: {
      scrollableParentTarget:
        | false
        | {
            id?: string;
            className?: string;
            ref?: React.RefObject<HTMLElement>;
          };
    };

    /** The incoming value to be set on render */
    incomingValue?: any;

    /** The incoming multi select values to be set on render */
    incomingMultiSelectValues?: any[];

    /** Enables or customizes the reset button */
    resetButton?: boolean | (string & { length: Exclude<number, 0> });

    /** Callback triggered when a menu is opened */
    onOpen?: (
      value: any | null,
      context: {
        oldValue: any;
        index: number;
        row: { label: string; value: any };
      }
    ) => void;

    /** Callback triggered when a menu is closed */
    onClose?: (
      value: any | null,
      context: {
        oldValue: any;
        index: number;
        row: { label: string; value: any };
      }
    ) => void;

    /** Callback triggered when a value is selected */
    onSelect?: (
      value: any,
      context: {
        oldValue: any;
        index: number;
        row: { label: string; value: any };
        triggeredBy: string;
      }
    ) => void;

    /** Function called before selecting a value */
    beforeSelect?: (
      value: any | null,
      context: {
        oldValue: any;
        index: number;
        row: { label: string; value: any };
        triggeredBy: string;
      }
    ) => boolean | void;

    /** Function called after selecting a value */
    afterSelect?: (
      value: any | null,
      context: {
        oldValue: any;
        index: number;
        row: { label: string; value: any };
        triggeredBy: string;
      }
    ) => void;

    /** An object used to observe changes in an external value and programmatically update the dropdown state. */
    changeObserver?: {
      target: any;
      handler: (
        setter: (value: any | null) => void,
        context: {
          newTargetedValue: any;
          oldTargetedValue: any;
          dropdownValue: any;
        }
      ) => void;
    };

    /** Custom arrow icon for the dropdown */
    customArrow?: {
      element: React.ReactNode;
    };

    /** Custom styles for various dropdown elements */
    styles?: {
      selectBox?: CSSProperties | string;
      selectedValue?: CSSProperties | string;
      placeholder?: CSSProperties | string;
      title?: CSSProperties | string;
      arrow?: CSSProperties | string;
      disabledState?: CSSProperties | string;
      optionsContainer?: CSSProperties | string;
      optionItem?: CSSProperties | string;
      selectedOptionItem?: CSSProperties | string;
      searchInput?: CSSProperties | string;
    };
  }

  /** DropDownBox component */

  type KeyPaths = {
    labelPath: string[];
    valuePath: string[];
  };

  type Option = {
    label: string;
    value: string;
  };

  const createOptions: (data: any[], paths: KeyPaths) => Option[] = (
    data,
    paths
  ) => {
    // your implementation here
    return [];
  };

  export { createOptions };

  const DropDownBox: React.FC<DropDownBoxPropsTypes>;
  export default DropDownBox;
}
