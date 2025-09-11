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
import { useSearchOptions } from '../../hooks/useSearchOptions';
import { useLectureData } from '../../hooks/useLectureData';
import { useFilteredLectures } from '../../hooks/useFilteredLectures';
import { usePagination } from '../../hooks/usePagination';
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

  // 1. 콜백 함수들만 가져오기 위한 임시 pagination
  const tempPagination = usePagination<Lecture>([]);

  // 2. searchOptions 정의 (resetPage, scrollToTop 사용)
  const { searchOptions, changeSearchOption } = useSearchOptions({
    searchInfo,
    onPageReset: tempPagination.resetPage,
    onScrollToTop: tempPagination.scrollToTop,
  });

  // 3. searchOptions를 사용해서 filteredLectures 계산
  const { filteredLectures, allMajors } = useFilteredLectures(
    lectures,
    searchOptions
  );

  // 4. 실제 filteredLectures로 pagination
  const {
    visibleItems: visibleLectures,
    loaderWrapperRef,
    loaderRef,
  } = usePagination<Lecture>(filteredLectures);

  // 5. addSchedule 함수 정의
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
