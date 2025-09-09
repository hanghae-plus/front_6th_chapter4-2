import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { memo } from "react";

interface FormCheckboxProp {
  label?: string;
  value?: (string | number)[] | undefined;
  onChange: (value: (string | number)[]) => void;
  options: { label?: string; value: string | number }[];
}

export const FormCheckbox = memo(
  ({ value, label, onChange, options }: FormCheckboxProp) => {
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <CheckboxGroup value={value} onChange={onChange}>
          <HStack spacing={options.length}>
            {options.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  }
);
FormCheckbox.displayName = "FormCheckbox";
