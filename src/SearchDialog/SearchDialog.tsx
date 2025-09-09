/**
 * 강의 검색 및 선택 다이얼로그 컴포넌트
 * 다양한 필터 옵션을 제공하여 강의를 검색하고 시간표에 추가할 수 있습니다.
 */
import { useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import SearchFilters from "./components/SearchFilters.tsx";
import SearchResultTable from "./components/SearchResultTable.tsx";
import { useLectureData } from "./hooks/useLectureData.ts";
import { useSearchLogic } from "./hooks/useSearchLogic.ts";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll.ts";
import { useScheduleManager } from "./hooks/useScheduleManager.ts";
import { SearchDialogProps } from "./types.ts";

/**
 * 강의 검색 다이얼로그 메인 컴포넌트
 * 검색 필터, 무한 스크롤, 강의 추가 기능을 제공합니다.
 *
 * 기능별로 분리된 커스텀 훅들을 조합하여 높은 응집도와 낮은 결합도를 달성했습니다.
 */
export const SearchDialog = ({ searchInfo, onClose }: SearchDialogProps) => {
  // 강의 데이터 관리
  const { lectures } = useLectureData();

  // 검색 로직 관리
  const {
    searchOptions,
    setSearchOptions,
    filteredLectures,
    allMajors,
    changeSearchOption,
  } = useSearchLogic(lectures);

  // 무한 스크롤 관리
  const {
    visibleItems: visibleLectures,
    loaderWrapperRef,
    loaderRef,
    resetPage,
  } = useInfiniteScroll(filteredLectures);

  // 스케줄 추가 관리
  const { addSchedule } = useScheduleManager(searchInfo, onClose);

  // 검색 옵션 변경 시 페이지 초기화
  const handleSearchOptionChange = (
    field: keyof typeof searchOptions,
    value: (typeof searchOptions)[typeof field]
  ) => {
    changeSearchOption(field, value);
    resetPage();
  };

  // 검색 정보 변경 시 초기 필터 설정
  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SearchFilters
              searchOptions={searchOptions}
              allMajors={allMajors}
              onSearchOptionChange={handleSearchOptionChange}
            />
            <SearchResultTable
              visibleLectures={visibleLectures}
              totalCount={filteredLectures.length}
              onAddSchedule={addSchedule}
              loaderWrapperRef={loaderWrapperRef}
              loaderRef={loaderRef}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
