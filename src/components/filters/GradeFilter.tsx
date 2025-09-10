import { memo } from "react";
import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
} from "@chakra-ui/react";
import { SearchOption } from "../../types";

interface Props {
  grades: number[];
  gradeCheckboxes: React.ReactElement[];
  onChangeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption]
  ) => void;
}

const GradeFilter = memo(
  ({ grades, gradeCheckboxes, onChangeSearchOption }: Props) => {
    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={grades}
          onChange={(value) =>
            onChangeSearchOption("grades", value.map(Number))
          }
        >
          <HStack spacing={4}>{gradeCheckboxes}</HStack>
        </CheckboxGroup>
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.grades.length === nextProps.grades.length &&
      prevProps.gradeCheckboxes === nextProps.gradeCheckboxes &&
      prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
    );
  }
);

export default GradeFilter;
