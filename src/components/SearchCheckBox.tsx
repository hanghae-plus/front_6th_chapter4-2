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
    // 배열 내용 비교
    if (prevProps.value.length !== nextProps.value.length) return false;
    return prevProps.value.every((v, i) => v === nextProps.value[i]);
  },
);

export default SearchCheckBox;
