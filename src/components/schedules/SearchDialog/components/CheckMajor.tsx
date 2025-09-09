import { Wrap } from '@chakra-ui/react/wrap';
import { memo, useCallback } from 'react';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react/checkbox';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { SearchOption } from '../SearchDialog.tsx';
import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react/tag';
import { FormControl } from '@chakra-ui/react/form-control';

const MajorCheckboxItem = memo(
  ({
    major,
    isChecked,
    onChange,
  }: {
    major: string;
    isChecked: boolean;
    onChange: (major: string) => void;
  }) => {
    // // 이 로그로 어떤 체크박스가 리렌더링되는지 확인 가능
    // console.log(`Rendering checkbox for: ${major}`);

    return (
      <Box>
        <Checkbox
          size="sm"
          isChecked={isChecked}
          onChange={() => onChange(major)}
        >
          {major}
        </Checkbox>
      </Box>
    );
  }
);
export const CheckMajor = memo(
  ({
    allMajors,
    selectedMajors,
    changeSearchOption,
  }: {
    changeSearchOption: (
      field: keyof SearchOption,
      value: SearchOption[typeof field]
    ) => void;
    allMajors: string[];
    selectedMajors: string[];
  }) => {
    const handleCheckboxToggle = useCallback(
      (major: string) => {
        const isCurrentlySelected = selectedMajors.includes(major);

        if (isCurrentlySelected) {
          changeSearchOption(
            'majors',
            selectedMajors.filter(m => m !== major)
          );
        } else {
          changeSearchOption('majors', [...selectedMajors, major]);
        }
      },
      [selectedMajors, changeSearchOption]
    );

    return (
      <FormControl>
        <label
          style={{
            display: 'block',
            fontSize: 16,
            fontWeight: 500,
            marginBottom: '0.5rem',
            marginInlineEnd: '0.75rem',
          }}
        >
          전공
        </label>
        <CheckboxGroup
          colorScheme="green"
          value={selectedMajors}
          onChange={values => changeSearchOption('majors', values as string[])}
        >
          <Wrap spacing={1} mb={2}>
            {selectedMajors.map(major => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split('<p>').pop()}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    changeSearchOption(
                      'majors',
                      selectedMajors.filter(v => v !== major)
                    );
                  }}
                />
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
              <MajorCheckboxItem
                key={major}
                major={major}
                isChecked={selectedMajors.includes(major)}
                onChange={handleCheckboxToggle}
              />
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    );
  }
);
