# `reusable-react-dropdown-component`

The `ru-react-dropdown-component` library provides the DropDownBox component, a customizable and feature-rich dropdown selector for React applications. This documentation outlines its props, behavior, and usage.

## Usage Example

```jsx
import React, { useState } from "react";
import DropDownBox from "ru-react-dropdown-component";

const MyComponent = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  return (
    <DropDownBox
      dropDownTitle="Select an option"
      animateDropDownTitle={true}
      options={options}
      placeholder="Choose..."
      size="medium"
      showSearchBar={true}
      customSetter={setSelectedValue}
      customDropBoxStyles={{ border: "1px solid #ccc" }}
      customTextStyle={{ color: "blue" }}
      resetButton={true}
    />
  );
};

export default MyComponent;
```

## Props

### `dropDownTitle`

- **Type:** `string`
- **Description:** The label for the dropdown.

### `animateDropDownTitle`

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
- **Description:** Sets predefined sizes for the dropdown. Accepted values are `"small"`, `"medium"`, `"large"`, or `"mini"`.

### `showSearchBar`

- **Type:** `boolean`
- **Description:** If true, shows a search bar within the dropdown.

### `customSetter`

- **Type:** `function`
- **Description:** Function to set the selected value. Typically used with `useState` or `formik.setFieldValue`.

### `customFormikLabel`

- **Type:** `string`
- **Description:** The label used for `formik.setFieldValue`.

### `customDropBoxStyles`

- **Type:** `object`
- **Description:** Custom styles for the select box.

### `disabled`

- **Type:** `boolean`
- **Default:** `false`
- **Description:** If true, disables the dropdown.

### `customTextStyle`

- **Type:** `object`
- **Description:** Custom styles for the text within the dropdown.

### `animateDropDownTitleStyle`

- **Type:** `object`
- **Description:** Object containing styles for the animated dropdown title. Format: `{ labelDown: { style }, labelUp: { style } }`.

### `incomingValue`

- **Type:** `string`
- **Description:** Incoming value to be set on render.

### `resetButton`

- **Type:** `boolean`
- **Description:** If true, shows a reset button to clear the selected value.

### `callCustomFunction`

- **Type:** `function`
- **Description:** Custom function to be called with the selected value.

### `customValueForCustomFunction`

- **Type:** `any`
- **Description:** Custom value to be passed to the `callCustomFunction`.

### `listApi`

- **Type:** `function`
- **Description:** API call function to fetch list options.

### `apiData`

- **Type:** `object`
- **Default:** `{}`
- **Description:** Data to be sent with the API request.

### `dispatch`

- **Type:** `function`
- **Description:** Redux dispatch function.

### `listOfKeyValue`

- **Type:** `object`
- **Description:** Object containing label and value keys for options. Format: `{ labelKey: "productName", valueKey: "productId" }`.

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
- `showSearchBar`
- `dropDownValueTwo`
- `resetButton`
- `menuOptions`
- `setDropDownValue`
- `setDropDownValueTwo`
- `setMenuOptions`
- `showMenu`
- `handleClick`
- `listApi`
- `dispatch`

### Notes

- Ensure to provide required props such as `options` and `customSetter` for proper functionality.
- The component is designed to be flexible with various styling and functionality customizations.

---

This documentation covers the main aspects of the `DropDownBox` component, including prop types, behaviors, and usage examples. Adjust as needed for your project's specific requirements.

# drop-down-npm-lib
