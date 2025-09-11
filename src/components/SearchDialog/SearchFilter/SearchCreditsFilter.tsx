import { FormControl, Select, FormLabel } from "@chakra-ui/react";
import { SearchOption } from "../../../types";
import { memo } from "react";

export const SearchCreditsFilter = memo(
  ({
    searchOptions,
    onChange,
  }: {
    searchOptions: SearchOption["credits"];
    onChange: (value: SearchOption["credits"]) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select
          value={searchOptions}
          onChange={(e) => onChange(e.target.value as unknown as number)}
        >
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    );
  }
);

SearchCreditsFilter.displayName = "SearchCreditsFilter";
