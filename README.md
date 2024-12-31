# `reusable-react-dropdown-component`

The `ru-react-dropdown-component` library provides the DropDownBox component, a customizable and feature-rich dropdown selector for React applications. This documentation outlines its props, behavior, and usage.

## Usage Example

```jsx
import React, { useState } from "react";
import DropDownBox from "ru-react-dropdown-component";
// Importing CSS is optional. However, if you notice a slight delay in applying styles, consider importing it for better performance.
import "ru-react-dropdown-component/dist/styles.css";

const MyComponent = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  return (
    <DropDownBox
      title="Select an option"
      animateTitle={true}
      options={options}
      placeholder="Choose..."
      size="medium"
      showSearch={true}
      setter={setSelectedValue}
      styles={{
        selectStyles: { border: "1px solid #ccc" },
        selectValueStyle: { color: "blue" },
      }}
      resetButton={true}
    />
  );
};

export default MyComponent;
```

## Props

### `title`

- **Type:** `string`
- **Description:** The label for the dropdown.

### `animateTitle`

- **Type:** `boolean`
- **Description:** If true, animates the dropdown title on focus or when a value is selected.

### `options`

- **Type:** `Array<{label: string, value: string}>`
- **Description:** Array of objects to populate the dropdown options.

### `placeholder`

- **Type:** `string`
- **Description:** Placeholder text for the dropdown.

### `size`

- **Type:** `string`
- **Description:** Sets predefined sizes for the dropdown. Accepted values are "small", "medium", "large", or "mini".

### `showSearch`

- **Type:** `boolean`
- **Description:** If true, shows a search bar within the dropdown.

### `setter`

- **Type:** `function`
- **Description:** Function to set the selected value. Typically used with `useState` or `formik.setFieldValue`.

### `disabled`

- **Type:** `boolean`
- **Default:** `false`
- **Description:** If true, disables the dropdown.

### `resetButton`

- **Type:** `boolean | string`
- **Description:** If true, shows a reset button to clear the selected value. If a string is provided, it will be used as the button text.

### `incomingValue`

- **Type:** `string`
- **Description:** Incoming value to be set on render.

### `customArrow`

- **Type:** `JSX.Element`
- **Description:** Custom JSX or SVG element to replace the default dropdown arrow.

### `styles`

- **Type:** `object`
- **Description:** Object containing styles for various parts of the dropdown. Keys include:
  - `selectStyles`: Styles for the select box.
  - `selectValueStyle`: Styles for the selected value text.
  - `placeholderStyle`: Styles for the placeholder text.
  - `titleStyle`: Styles for the title.
  - `arrowStyle`: Styles for the dropdown arrow.
  - `disableStyle`: Styles for the dropdown when disabled.
  - `optionsBoxStyle`: Styles for the dropdown options container.
  - `optionsStyle`: Styles for individual options.
  - `searchBoxStyle`: Styles for the search bar.

### Behavior

### State Variables

- `showMenu`: Controls the visibility of the dropdown menu.
- `addStyle`: Toggles additional styles for the dropdown arrow.
- `menuOptions`: Holds the options to be displayed in the dropdown menu.
- `dropDownValue`: Holds the current displayed value of the dropdown.
- `dropDownValueTwo`: Holds the current selected value's internal representation.

### Methods

- `handleClick`: Toggles the dropdown menu visibility and handles styling.
- `DropBoxVisibility`: Manages the visibility of the dropdown menu with a delay for smooth transition.
- `useEffect` for updating state based on props and other dependencies.

#### All Props

- `options`
- `disabled`
- `addStyle`
- `showSearch`
- `dropDownValueTwo`
- `resetButton`
- `menuOptions`
- `setDropDownValue`
- `setDropDownValueTwo`
- `setMenuOptions`
- `showMenu`
- `handleClick`

### Notes

- Ensure to provide required props such as `options` and `setter` for proper functionality.
- The component is designed to be flexible with various styling and functionality customizations.

---

This documentation covers the main aspects of the `DropDownBox` component, including prop types, behaviors, and usage examples. Adjust as needed for your project's specific requirements.
