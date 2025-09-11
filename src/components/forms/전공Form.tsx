import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  Wrap,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { memo } from "react";
import 전공FormList from "./전공Form.List";

interface Props {
  majors: string[];
  allMajors: string[];
  onMajorsChange: (majors: string[]) => void;
}

function 전공Form({ majors, allMajors, onMajorsChange }: Props) {
  return (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={majors}
        onChange={(values) => onMajorsChange(values as string[])}
      >
        <Wrap spacing={1} mb={2}>
          {majors.map((major) => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split("<p>").pop()}</TagLabel>
              <TagCloseButton
                onClick={() =>
                  onMajorsChange(majors.filter((v) => v !== major))
                }
              />
            </Tag>
          ))}
        </Wrap>
        <전공FormList allMajors={allMajors} />
      </CheckboxGroup>
    </FormControl>
  );
}

export default memo(전공Form);
