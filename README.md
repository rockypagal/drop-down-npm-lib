# `reusable-react-dropdown-component`

The `ru-react-dropdown-component` library provides the DropDownBox component, a customizable and feature-rich dropdown selector for React applications. This documentation outlines its props, behavior, and usage.

## Demo and DOCS

[👉 ru-react-dropdown-component.vercel.app](https://👉ru-react-dropdown-component.vercel.app)

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
      searchOptions: ["xyz@email.com", "123-456-789"],
    },
  ];

  return (
    <DropDownBox
      title="Select City"
      animateTitle={true}
      options={options}
      placeholder="Choose..."
      size="medium"
      showSearch={true}
      onSelect={(value, context) => {
        console.log(value, context);
      }}
      beforeSelect={(value, context) => {
        console.log(value, context);
      }}
      afterSelect={(value, context) => {
        console.log(value, context);
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
        selectBox: { border: "1px solid #ccc" },
        selectedValue: { color: "blue" },
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

1. `title`
2. `animateTitle`
3. `options`
4. `placeholder`
5. `size`
6. `showSearch`
7. `customArrow`
8. `disabled`
9. `loading`
10. `hideScrollbar`
11. `incomingValue`
12. `resetButton`
13. `onSelect`
14. `beforeSelect`
15. `afterSelect`
16. `changeObserver`

- `target`
- `handler`

17. `styles`

- `selectBox`
- `selectedValue`
- `placeholder`
- `title`
- `arrow`
- `disabledState`
- `optionsContainer`
- `optionItem`
- `searchInput`
