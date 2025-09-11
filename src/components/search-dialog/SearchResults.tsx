import { memo } from 'react';
import { Box, Table, Tbody, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Lecture } from '../../types';
import { SearchItem } from './SearchItem';

interface SearchResultsProps {
  filteredLectures: Lecture[];
  visibleLectures: Lecture[];
  addSchedule: (lecture: Lecture) => void;
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

export const SearchResults = memo(
  ({
    filteredLectures,
    visibleLectures,
    addSchedule,
    loaderWrapperRef,
    loaderRef,
  }: SearchResultsProps) => {
    return (
      <>
        <Text align='right'>검색결과: {filteredLectures.length}개</Text>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th width='100px'>과목코드</Th>
                <Th width='50px'>학년</Th>
                <Th width='200px'>과목명</Th>
                <Th width='50px'>학점</Th>
                <Th width='150px'>전공</Th>
                <Th width='150px'>시간</Th>
                <Th width='80px'></Th>
              </Tr>
            </Thead>
          </Table>

          <Box overflowY='auto' maxH='500px' ref={loaderWrapperRef}>
            <Table size='sm' variant='striped'>
              <Tbody>
                {visibleLectures.map((lecture, index) => (
                  <SearchItem
                    key={`${lecture.id}-${index}`}
                    addSchedule={addSchedule}
                    {...lecture}
                  />
                ))}
              </Tbody>
            </Table>
            <Box ref={loaderRef} h='20px' />
          </Box>
        </Box>
      </>
    );
  }
);

SearchResults.displayName = 'SearchResults';
