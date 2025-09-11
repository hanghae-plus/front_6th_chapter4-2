import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { ComponentPropsWithRef, memo } from "react";

interface FormSelectProp extends ComponentPropsWithRef<"select"> {
  label?: string;
  value: number | string | string[] | undefined;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
}

export const FormSelect = memo(
  ({ label, value, onChange, options }: FormSelectProp) => {
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Select value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
    );
  }
);
FormSelect.displayName = "FormSelect";
