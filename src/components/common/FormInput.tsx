import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { ComponentPropsWithRef, memo } from "react";

interface FormInputProp extends ComponentPropsWithRef<"input"> {
  label: string;
  value: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const FormInput = memo(
  ({ label, value, onChange, placeholder }: FormInputProp) => {
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input placeholder={placeholder} value={value} onChange={onChange} />
      </FormControl>
    );
  }
);
FormInput.displayName = "FormInput";
