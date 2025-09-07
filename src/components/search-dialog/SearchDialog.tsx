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
import { useAddSchedule, useInfiniteLectures, useLectures, useSearchOption } from "./hooks";
import { SearchItem } from "./SearchItem";
import { SearchInfo } from "./types";
import { SearchDialogControls } from "./SearchDialogControls.tsx";

interface Props {
  searchInfo: SearchInfo | null;
  onAddSchedule: () => void;
  onOverlayClick: () => void;
}

export const SearchDialog = ({ searchInfo, onAddSchedule, onOverlayClick }: Props) => {
  const searchOptions = useSearchOption({
    searchInfo,
    onChange: () => infiniteLectures.reset(),
  });
  const lectures = useLectures({ searchOptions: searchOptions.values });
  const infiniteLectures = useInfiniteLectures({ items: lectures.items });
  const addSchedule = useAddSchedule({ tableId: searchInfo?.tableId, onAdd: onAddSchedule });

  if (!searchInfo) {
    return null;
  }

  return (
    <Modal isOpen onClose={onOverlayClick} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchDialogControls.Search value={searchOptions.query.value} onChange={searchOptions.query.change} />

              <SearchDialogControls.Credits
                value={searchOptions.credits.value}
                onChange={searchOptions.credits.change}
              />
            </HStack>

            <HStack spacing={4}>
              <SearchDialogControls.Grads value={searchOptions.grades.value} onChange={searchOptions.grades.change} />

              <SearchDialogControls.Days value={searchOptions.days.value} onChange={searchOptions.days.change} />
            </HStack>

            <HStack spacing={4}>
              <SearchDialogControls.Times value={searchOptions.times.value} onChange={searchOptions.times.change} />

              <SearchDialogControls.Majors
                value={searchOptions.majors.value}
                onChange={searchOptions.majors.change}
                options={lectures.allMajors}
              />
            </HStack>
            <Text align="right">검색결과: {lectures.items.length}개</Text>
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

              <Box
                overflowY="auto"
                maxH="500px"
                ref={infiniteLectures.wrapperRef}
                sx={{
                  fontSize: "sm",
                  "& td": { px: 4, py: 2 },
                  "& button": {
                    transition: "0.15s",
                    fontSize: "sm",
                    bg: "green.500",
                    color: "white",
                    px: 4,
                    py: 2,
                    borderRadius: "md",
                    _hover: { bg: "green.600" },
                  },
                }}
              >
                <Table size="sm" variant="striped">
                  <Tbody>
                    {infiniteLectures.items.map((lecture, index) => (
                      <SearchItem key={`${lecture.id}-${index}`} {...lecture} addSchedule={addSchedule} />
                    ))}
                  </Tbody>
                </Table>
                <Box ref={infiniteLectures.ref} h="20px" />
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
