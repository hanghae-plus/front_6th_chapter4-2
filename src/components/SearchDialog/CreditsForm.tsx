import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { memo } from "react";
import { SearchOption } from "../../SearchDialog";

type CreditsFormProps = {
  credits?: number;
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
};

const CreditsForm = memo(
  ({ credits, changeSearchOption }: CreditsFormProps) => {
    return (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select
          value={credits}
          onChange={(e) => changeSearchOption("credits", e.target.value)}
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

export default CreditsForm;
