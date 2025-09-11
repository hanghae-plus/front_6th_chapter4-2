import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { memo } from "react";

const SearchSelect = memo(
  ({
    value,
    handleChange,
  }: {
    value: number | undefined;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select value={value} onChange={handleChange}>
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  },
);

export default SearchSelect;
