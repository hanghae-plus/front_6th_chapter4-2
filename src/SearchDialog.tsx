import { useEffect } from "react";
import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { Lecture } from "./types.ts";

import { useLectureData } from "./hooks/useLectureData.ts";
import { useSearchLectures } from "./hooks/useSearchLectures.ts";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll.ts";
import { useScheduleManagement } from "./hooks/useScheduleManagement.ts";
import SearchForm from "./components/forms/SearchForm.tsx";
import CreditForm from "./components/forms/CreditForm.tsx";
import GradeForm from "./components/forms/GradeForm.tsx";
import DayForm from "./components/forms/DayForm.tsx";
import TimeForm from "./components/forms/TimeForm.tsx";
import MajorForm from "./components/forms/MajorForm.tsx";
import ResultTable from "./components/ResultTable.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { lectures, allMajors } = useLectureData();
  const {
    filteredLectures,
    visibleLectures,
    setPage,
    lastPage,
    searchOptions,
    changeSearchOption,
    setSearchOptionsFromInfo,
  } = useSearchLectures(lectures);

  const { loaderRef, loaderWrapperRef } = useInfiniteScroll({
    lastPage,
    setPage,
  });

  const { addSchedule } = useScheduleManagement();

  const handleAddSchedule = (lecture: Lecture) => {
    if (!searchInfo) return;
    addSchedule(lecture, searchInfo.tableId);
    onClose();
  };

  useEffect(() => {
    setSearchOptionsFromInfo(searchInfo);
  }, [searchInfo, setSearchOptionsFromInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchForm
                keyword={searchOptions.query}
                onKeywordChange={(value) => changeSearchOption("query", value)}
              />
              <CreditForm
                credits={searchOptions.credits}
                onCreditsChange={(value) =>
                  changeSearchOption("credits", value)
                }
              />
            </HStack>

            <HStack spacing={4}>
              <GradeForm
                grades={searchOptions.grades}
                onGradesChange={(value) => changeSearchOption("grades", value)}
              />

              <DayForm
                days={searchOptions.days}
                onDaysChange={(value) => changeSearchOption("days", value)}
              />
            </HStack>

            <HStack spacing={4}>
              <TimeForm
                times={searchOptions.times}
                onTimesChange={(value) => changeSearchOption("times", value)}
              />
            </HStack>

            <HStack spacing={4}>
              <MajorForm
                majors={searchOptions.majors}
                allMajors={allMajors}
                onMajorsChange={(value) => changeSearchOption("majors", value)}
              />
            </HStack>

            <ResultTable
              filteredLectures={filteredLectures}
              visibleLectures={visibleLectures}
              loaderRef={loaderRef}
              loaderWrapperRef={loaderWrapperRef}
              handleAddSchedule={handleAddSchedule}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
