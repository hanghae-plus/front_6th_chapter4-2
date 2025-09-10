import { memo, useCallback } from "react";
import { FormControl, FormLabel, CheckboxGroup, Wrap } from "@chakra-ui/react";
import { SearchOption } from "../../types";
import MajorTag from "../tags/MajorTag";
import MajorList from "../lists/MajorList";

interface Props {
  majors: string[];
  allMajors: string[];
  onChangeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption]
  ) => void;
}

const MajorFilter = memo(
  ({ majors, allMajors, onChangeSearchOption }: Props) => {
    const removeMajor = useCallback(
      (major: string) => {
        onChangeSearchOption(
          "majors",
          majors.filter((v) => v !== major)
        );
      },
      [onChangeSearchOption, majors]
    );

    const handleMajorsChange = useCallback(
      (values: (string | number)[]) => {
        onChangeSearchOption("majors", values as string[]);
      },
      [onChangeSearchOption]
    );

    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={majors}
          onChange={handleMajorsChange}
        >
          <Wrap spacing={1} mb={2}>
            {majors.map((major) => (
              <MajorTag key={major} major={major} onRemove={removeMajor} />
            ))}
          </Wrap>
          <MajorList allMajors={allMajors} />
        </CheckboxGroup>
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.majors.length === nextProps.majors.length &&
      prevProps.allMajors.length === nextProps.allMajors.length &&
      prevProps.onChangeSearchOption === nextProps.onChangeSearchOption
    );
  }
);

export default MajorFilter;
