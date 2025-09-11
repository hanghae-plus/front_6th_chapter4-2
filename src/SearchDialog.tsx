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
import 검색어Form from "./components/forms/검색어Form.tsx";
import 학점Form from "./components/forms/학점Form.tsx";
import 학년Form from "./components/forms/학년Form.tsx";
import 요일Form from "./components/forms/요일Form.tsx";
import 시간Form from "./components/forms/시간Form.tsx";
import 전공Form from "./components/forms/전공Form.tsx";
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
              <검색어Form
                keyword={searchOptions.query}
                onKeywordChange={(value) => changeSearchOption("query", value)}
              />
              <학점Form
                credits={searchOptions.credits}
                onCreditsChange={(value) =>
                  changeSearchOption("credits", value)
                }
              />
            </HStack>

            <HStack spacing={4}>
              <학년Form
                grades={searchOptions.grades}
                onGradesChange={(value) => changeSearchOption("grades", value)}
              />

              <요일Form
                days={searchOptions.days}
                onDaysChange={(value) => changeSearchOption("days", value)}
              />
            </HStack>

            <HStack spacing={4}>
              <시간Form
                times={searchOptions.times}
                onTimesChange={(value) => changeSearchOption("times", value)}
              />
            </HStack>

            <HStack spacing={4}>
              <전공Form
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
