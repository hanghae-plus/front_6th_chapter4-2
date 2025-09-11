import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useSearchOptionsStore } from "../../../../store/searchOptionsStore";
import { memo } from "react";

export const CreditsForm = memo(() => {
  const credits = useSearchOptionsStore((state) => state.searchOptions.credits);
  const setCredits = useSearchOptionsStore((state) => state.setCredits);

  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={credits} onChange={(e) => setCredits(e.target.value)}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
});
