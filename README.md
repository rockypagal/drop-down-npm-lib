# `reusable-react-dropdown-component`

The `ru-react-dropdown-component` library provides the DropDownBox component, a customizable and feature-rich dropdown selector for React applications. This documentation outlines its props, behavior, and usage.

## Usage Example

```jsx
import React, { useState } from "react";
import DropDownBox from "ru-react-dropdown-component";
// Importing CSS is optional. However, if you notice a slight delay in
//  styles being applied, consider importing it for better performance.
import "ru-react-dropdown-component/dist/styles.css";

const MyComponent = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  return (
    <DropDownBox
      title="Select City"
      animateTitle={true}
      options={options}
      placeholder="Choose..."
      size="medium"
      showSearch={true}
      onSelect={setSelectedValue}
      beforeSelect={(value, context) => {
        console.log(value, context);
      }}
      afterSelect={(value) => {
        console.log("value: ", value);
      }}
      changeObserver={{
        target: country,
        handler: (setter, context) => {
          if (context.dropdownValue) {
            setter("");
          }
        },
      }}
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

### Notes

- Ensure to provide required props such as `options` and `setter` or `onSelect` for proper functionality.
- The component is designed to be flexible with various styling and functionality customizations.

## Props

### `options`

- **Type:** `Array[{label: string, value: string}]`
- **Description:** Array of objects to populate the dropdown options.

---

### `onSelect`

- **Type:** `function`
- **Description:** Callback function triggered when an option is selected. `Receives two arguments: first the selected value and an optional object` for additional data.
- **Note:** Useful for executing additional logic, such as updating state or triggering side effects, when a value is selected `use can use only one function to get selected value either use onSelect or setter`.

Here are detailed documentation entries for the `beforeSelect`, `afterSelect`, and `changeObserver` props based on the provided library code:

---

### `beforeSelect`

- **Type:** `function`
- **Description:** A callback function that executes before an option is selected. It can be used to validate or modify the selection process.
- **Arguments:**
  - `value` (string): The value of the option being selected.
  - `context` (object): Contains additional information about the selection:
    - `oldValue`: The previously selected value.
    - `index`: The index of the selected option in the options array.
    - `row`: The entire option object (`{ label, value }`).
- **Return Value:** Returning `false` from this function prevents the selection and keeps the dropdown in its current state.
- **Note:** Useful for implementing conditional logic or validation before updating the selected value.

### `afterSelect`

- **Type:** `function`
- **Description:** A callback function triggered after a value is successfully selected.
- **Arguments:**
  - `selectedValue` (string): The value of the option that was selected.
- **Note:** Ideal for performing side effects such as API calls, updating analytics, or dispatching additional actions after a selection is made.

### `changeObserver`

- **Type:** `object`
- **Description:** An object used to observe changes in an external value and programmatically update the dropdown state.
- **Properties:**
  - `target` (any): The value to observe for changes.
  - `handler` (function): A callback function that executes whenever the `target` value changes.
    - **Arguments:**
      - `setter` (function): A function to update the dropdown's selected value.
      - `context` (object): Contains:
        - `newTargetedValue`: The updated value of the `target`.
        - `oldTargetedValue`: The previous value of the `target`.
        - `dropdownValue`: The current value of the dropdown.
- **Note:** Use this to synchronize the dropdown with external data sources, such as Redux state or form values.

---

### `setter`

- **Type:** `function`
- **Description:** Function to set the selected value. Typically used with `useState`.
- **Note:** It is easy to use and simple and recommended if you only want to get the selected value.

### `title`

- **Type:** `string`
- **Description:** The label for the dropdown.

### `animateTitle`

- **Type:** `boolean`
- **Description:** If true, animates the dropdown title on focus or when a value is selected.

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

### `placeholder`

- **Type:** `string`
- **Description:** Placeholder text for the dropdown.

### `size`

- **Type:** `string`
- **Description:** Sets predefined sizes for the dropdown. Accepted values are "small", "medium", "large", or "mini".

### `showSearch`

- **Type:** `boolean`
- **Description:** If true, shows a search bar within the dropdown.

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

### List of All Props

1. `title`
2. `animateTitle`
3. `options`
4. `placeholder`
5. `size`
6. `showSearch`
7. `setter`
8. `disabled`
9. `incomingValue`
10. `resetButton`
11. `onSelect`
12. `beforeSelect`
13. `afterSelect`
14. `customArrow`
15. `styles`

- `selectStyles`
- `selectValueStyle`
- `placeholderStyle`
- `titleStyle`
- `arrowStyle`
- `disableStyle`
- `optionsBoxStyle`
- `optionsStyle`
- `searchBoxStyle`

---

This documentation covers the main aspects of the `DropDownBox` component, including prop types, behaviors, and usage examples. Adjust as needed for your project's specific requirements.
