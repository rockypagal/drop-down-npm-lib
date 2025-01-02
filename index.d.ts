declare module "ru-react-dropdown-component" {
  import React, { CSSProperties } from "react";

  export interface DropDownOption {
    label: string;
    value: string;
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

    /** Size of the dropdown (e.g., "small", "medium", "large", "mini") */
    size?: "small" | "medium" | "large" | "mini";

    /** Enables the search bar within the dropdown */
    showSearch?: boolean;

    /** Function to set the selected value, e.g., useState or Formik setFieldValue */
    setter?: (value: string | null) => void;

    /** Disables the dropdown if set to true */
    disabled?: boolean;

    /** The incoming value to be set on render */
    incomingValue?: string;

    /** Enables or customizes the reset button */
    resetButton?: boolean | string;

    /** Callback triggered when a value is selected */
    onSelect?: (value: string | null, extraData?: any) => void;

    /** Function called before selecting a value */
    beforeSelect?: (value: string | null) => void;

    /** Function called after selecting a value */
    afterSelect?: (value: string | null) => void;

    /** Custom arrow icon for the dropdown */
    customArrow?: {
      element: React.ReactNode;
    };

    /** Custom styles for various dropdown elements */
    styles?: {
      selectStyles?: CSSProperties;
      selectValueStyle?: CSSProperties;
      placeholderStyle?: CSSProperties;
      titleStyle?: CSSProperties;
      arrowStyle?: CSSProperties;
      disableStyle?: CSSProperties;
      optionsBoxStyle?: CSSProperties;
      optionsStyle?: CSSProperties;
      searchBoxStyle?: CSSProperties;
    };
  }

  /** DropDownBox component */
  const DropDownBox: React.FC<DropDownBoxProps>;

  export default DropDownBox;
}
