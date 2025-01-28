# `reusable-react-dropdown-component`

The `ru-react-dropdown-component` library provides the DropDownBox component, a customizable and feature-rich dropdown selector for React applications. This documentation outlines its props, behavior, and usage.

## Usage Example

```jsx
import React, { useState } from "react";
import DropDownBox from "ru-react-dropdown-component";
// Importing CSS is optional. However, if you notice a slight delay in
//  styles being applied, consider importing it for better performance.
import "ru-react-dropdown-component/dist/styles.css";

const MyComponent = ({ country }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const options = [
    { label: "Option 1", value: "option1" },
   {
    label: "Option 2",
    value: "option2",
    // Additional searchable values for this option
    searchOptions: ["xyz@email.com", "123-456-789"]
   }

  ];

  return (
    <DropDownBox
      title="Select City"
      animateTitle={true}
      options={options}
      placeholder="Choose..."
      size="medium"
      showSearch={true}
      onSelect=={(value, context) => {
        console.log(value, context);
      }}
      beforeSelect={(value, context) => {
        console.log(value, context);
      }}
      afterSelect={(value,context) => {
        console.log(value,context);
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

- Ensure to provide required props such as `options` and `onSelect` for proper functionality.
- The component is designed to be flexible with various styling and functionality customizations.

## Props

### `options`

- **Type:** `Array<{ label: string, value: string }>`
- **Extended Type (Optional):** `Array<{ label: string, value: string, searchOptions: string[] }>`
- **Description:** Defines the options for the dropdown as an array of objects. Each object requires a `label` (display text) and a `value`. Optionally, include a `searchOptions` array to add extra searchable values for that particular option.

### `onSelect`

- **Type:** `function`
  **Description:** Callback function triggered when an option is selected. It receives two arguments: the first is the selected value, and the second is a context object containing metadata about the selected option.
- **Arguments:**
  - `selectedValue` (string): The selected value.
  - `context` (object):
    - `oldValue`: Previously selected value.
    - `index`: Index of the option.
    - `row`: Option object (`{ label, value }`).

### `title`

- **Type:** `string`
- **Description:** The label for the dropdown.

### `animateTitle`

- **Type:** `boolean`
- **Description:** If true, animates the dropdown title on focus or when a value is selected and use only when placeholder is not in use.

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

- **Type:** `boolean | { delay: number (milliseconds) }`
- **Description:** If `true`, enables a search bar within the dropdown. When provided as an object with a `delay`, it applies a debounce for the specified number of milliseconds to enhance performance.

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
- **Note:** Useful when value is coming from api or some other external sources.

### `customArrow`

- **Type:** `JSX.Element`
- **Description:** Custom JSX or SVG element to replace the default dropdown arrow.

### `beforeSelect`

- **Type:** `function`
- **Description:** Executes before an option is selected. Return `false` to prevent the selection. Useful for validation or conditional logic. It receives two arguments: the first is the selected value, and the second is a context object containing metadata about the selected option.
- **Arguments:**
  - `value` (string): The selected option's value.
  - `context` (object):
    - `oldValue`: Previously selected value.
    - `index`: Index of the option.
    - `row`: Option object (`{ label, value }`).

### `afterSelect`

- **Type:** `function`
- **Description:** Triggered after a value is selected. Ideal for side effects like API calls or analytics. It receives two arguments: the first is the selected value, and the second is a context object containing metadata about the selected option.
- **Arguments:**
  - `selectedValue` (string): The selected value.
  - `context` (object):
    - `oldValue`: Previously selected value.
    - `index`: Index of the option.
    - `row`: Option object (`{ label, value }`).

### `changeObserver`

- **Type:** `object`
- **Description:** An object used to observe changes in an external value and programmatically update the dropdown state.
- **Properties:**
  - `target`: Observed value.
  - `handler` (function): Updates the dropdown when `target` changes.
    - **Arguments:**
      - `setter`: Updates dropdown's selected value.
      - `context` (object):
        - `newTargetedValue`: Updated `target` value.
        - `oldTargetedValue`: Previous `target` value.
        - `dropdownValue`: Current dropdown value.

### List of All Props

1. `title`
2. `animateTitle`
3. `options`
4. `placeholder`
5. `size`
6. `showSearch`
7. `customArrow`
8. `disabled`
9. `incomingValue`
10. `resetButton`
11. `onSelect`
12. `beforeSelect`
13. `afterSelect`
14. `changeObserver`

- `target`
- `handler`

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
