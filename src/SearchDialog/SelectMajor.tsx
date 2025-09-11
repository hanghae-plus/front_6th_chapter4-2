import {
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from '@chakra-ui/react';
import { memo, useCallback, useMemo } from 'react';
import { SearchOption } from '.';
import { Lecture } from '../types.ts';
import CheckboxItem from './CheckboxItem.tsx';

interface Props {
  majors: string[];
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
  lectures: Lecture[];
}

const SelectMajor = memo(({ majors, changeSearchOption, lectures }: Props) => {
  const allMajors = useMemo(() => [...new Set(lectures.map(lecture => lecture.major))], [lectures]);

  const handleMajorChange = useCallback(
    (value: string[]) => {
      changeSearchOption('majors', value);
    },
    [changeSearchOption]
  );

  const handleMajorClose = useCallback(
    (major: string) => {
      changeSearchOption(
        'majors',
        majors.filter(v => v !== major)
      );
    },
    [changeSearchOption, majors]
  );

  return (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup colorScheme="green" value={majors} onChange={handleMajorChange}>
        <Wrap spacing={1} mb={2}>
          {majors.map(major => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split('<p>').pop()}</TagLabel>
              <TagCloseButton onClick={() => handleMajorClose(major)} />
            </Tag>
          ))}
        </Wrap>
        <Stack
          spacing={2}
          overflowY="auto"
          h="100px"
          border="1px solid"
          borderColor="gray.200"
          borderRadius={5}
          p={2}
        >
          {allMajors.map(major => (
            <CheckboxItem key={major} value={major}>
              {major.replace(/<p>/gi, ' ')}
            </CheckboxItem>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  );
});

SelectMajor.displayName = 'SelectMajor';

export default SelectMajor;
