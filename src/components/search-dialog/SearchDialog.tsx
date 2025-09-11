import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { useScheduleContext } from '../../ScheduleContext';
import { Lecture } from '../../types';
import { parseSchedule } from '../../utils';
import { useLectureData } from '../../hooks/useLectureData';
import { useSearchWithPagination } from '../../hooks/useSearchWithPagination';
import { useAutoCallback } from '../../hooks/useAutoCallback';
import { SearchForm } from './SearchForm';
import { SearchResults } from './SearchResults';

interface SearchDialogProps {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

export const SearchDialog = ({ searchInfo, onClose }: SearchDialogProps) => {
  const { setSchedulesMap } = useScheduleContext();
  const { lectures, isLoading } = useLectureData();

  // 통합된 검색 + 페이지네이션 훅
  const {
    searchOptions,
    changeSearchOption,
    filteredLectures,
    allMajors,
    visibleLectures,
    loaderWrapperRef,
    loaderRef,
  } = useSearchWithPagination({
    searchInfo,
    lectures,
  });

  // addSchedule 함수 정의
  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));

    onClose();
  });

  if (isLoading) {
    return (
      <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size='6xl'>
        <ModalOverlay />
        <ModalContent maxW='90vw' w='1000px'>
          <ModalHeader>수업 검색</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>Loading...</div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size='6xl'>
      <ModalOverlay />
      <ModalContent maxW='90vw' w='1000px'>
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align='stretch'>
            <SearchForm
              searchOptions={searchOptions}
              allMajors={allMajors}
              changeSearchOption={changeSearchOption}
            />
            <SearchResults
              filteredLectures={filteredLectures}
              visibleLectures={visibleLectures}
              addSchedule={addSchedule}
              loaderWrapperRef={loaderWrapperRef}
              loaderRef={loaderRef}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
