import { CheckboxGroup, FormControl, FormLabel } from "@chakra-ui/react";
import React from "react";

const SearchCheckBox = React.memo(
  ({
    label,
    value,
    children,
    handleChange,
  }: {
    label: string;
    value: (string | number)[];
    children: React.ReactNode;
    handleChange: (value: Array<string | number>) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <CheckboxGroup value={value} onChange={handleChange}>
          {children}
        </CheckboxGroup>
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    // query 값만 비교
    return prevProps.value === nextProps.value;
  },
);

export default SearchCheckBox;
