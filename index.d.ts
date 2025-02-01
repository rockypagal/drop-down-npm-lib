declare module "ru-react-dropdown-component" {
  import React, { CSSProperties } from "react";

  export interface DropDownOption {
    label: string; // Label to display in the dropdown
    value: any; // Value associated with the option
    searchOptions?: string[]; // Array of strings used for search functionality
  }

  export interface DropDownBoxProps {
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

    /** Size of the dropdown (e.g., "small", "large", "mini") */
    size?: "small" | "medium" | "mini";

    /** Enables the search bar within the dropdown */
    showSearch?: boolean | { delay: number };

    /** Function to set the selected value, e.g., useState or Formik setFieldValue */
    // setter?: (value: string | null) => void;

    /** Disables the dropdown if set to true */
    disabled?: boolean;

    /** The incoming value to be set on render */
    incomingValue?: any;

    /** Enables or customizes the reset button */
    resetButton?: boolean | string;

    /** Callback triggered when a value is selected */
    onSelect?: (
      value: any,
      context: {
        oldValue: any;
        index: number;
        row: { label: string; value: any };
      }
    ) => void;

    /** Function called before selecting a value */
    beforeSelect?: (
      value: any | null,
      context: {
        oldValue: any;
        index: number;
        row: { label: string; value: any };
      }
    ) => void;

    /** Function called after selecting a value */
    afterSelect?: (
      value: any | null,
      context: {
        oldValue: any;
        index: number;
        row: { label: string; value: any };
      }
    ) => void;
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
  const DropDownBox: React.FC<DropDownBoxProps>;

  export default DropDownBox;
}
