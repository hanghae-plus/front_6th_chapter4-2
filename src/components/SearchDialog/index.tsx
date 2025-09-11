import { useEffect, useRef } from "react";
import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useScheduleStore } from "../../store/scheduleStore";
import { useAutoCallback } from "../../hooks/useAutoCallback.ts";
import { useLectureData } from "../../hooks/useLectureData.ts";
import { useLectureFilter } from "../../hooks/useLectureFilter.ts";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll.ts";
import { Lecture } from "../../types";
import { parseSchedule } from "../../lib/utils";
import { GradeFilter } from "./GradeFilter.tsx";
import { DayFilter } from "./DayFilter.tsx";
import { SearchFilter } from "./SearchFilter.tsx";
import { CreditFilter } from "./CreditFilter.tsx";
import { TimeFilter } from "./TimeFilter.tsx";
import { MajorFilter } from "./MajorFilter.tsx";
import { SearchItem } from "./SearchItem.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { processedLectures, allMajors } = useLectureData();
  const { searchOptions, changeSearchOption, filteredLectures } =
    useLectureFilter(processedLectures);
  const { visibleLectures, loaderRef, hasMore } = useInfiniteScroll(filteredLectures);

  const setSchedulesMap = useScheduleStore((state) => state.setSchedulesMap);

  const loaderWrapperRef = useRef<HTMLDivElement>(null);

  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev: any) => {
      return {
        ...prev,
        [tableId]: [...(prev[tableId] || []), ...schedules],
      };
    });
    onClose();
  });

  useEffect(() => {
    if (searchInfo) {
      changeSearchOption("days", searchInfo?.day ? [searchInfo.day] : []);
      changeSearchOption("times", searchInfo?.time ? [searchInfo.time] : []);
    }
  }, [searchInfo, changeSearchOption]);

  useEffect(() => {
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, [filteredLectures]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchFilter searchQuery={searchOptions.query} onChange={changeSearchOption} />
              <CreditFilter selectedCredit={searchOptions.credits} onChange={changeSearchOption} />
            </HStack>
            <HStack spacing={4}>
              <GradeFilter selectedGrades={searchOptions.grades} onChange={changeSearchOption} />
              <DayFilter selectedDays={searchOptions.days} onChange={changeSearchOption} />
            </HStack>
            <HStack spacing={4}>
              <TimeFilter selectedTimes={searchOptions.times} onChange={changeSearchOption} />
              <MajorFilter
                allMajors={allMajors}
                selectedMajors={searchOptions.majors}
                onChange={changeSearchOption}
              />
            </HStack>
            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <Box>
              <Table>
                <Thead>
                  <Tr>
                    <Th width="100px">과목코드</Th>
                    <Th width="50px">학년</Th>
                    <Th width="200px">과목명</Th>
                    <Th width="50px">학점</Th>
                    <Th width="150px">전공</Th>
                    <Th width="150px">시간</Th>
                    <Th width="80px"></Th>
                  </Tr>
                </Thead>
              </Table>
              <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
                <Table size="sm" variant="striped">
                  <Tbody>
                    {visibleLectures.map((lecture, index) => (
                      <SearchItem
                        key={`${lecture.id}-${index}`}
                        {...lecture}
                        addSchedule={addSchedule}
                      />
                    ))}
                  </Tbody>
                </Table>
                {hasMore && <Box ref={loaderRef} h="20px" />}
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
