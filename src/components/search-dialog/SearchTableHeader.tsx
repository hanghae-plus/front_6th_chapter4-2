import { Table, Tr, Th, Thead } from "@chakra-ui/react";
import { memo } from "react";

const SearchTableHeader = () => {
  return (
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
  );
};
SearchTableHeader.displayName = 'SearchTableHeader';

export default memo(SearchTableHeader);