import { memo } from "react";
import { Table, Thead, Tr, Th } from "@chakra-ui/react";

/**
 * 검색 결과 테이블의 헤더 컴포넌트
 * React.memo로 최적화되어 props가 변경되지 않으면 리렌더링되지 않습니다.
 */
const SearchTableHeader = memo(() => {
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
});

SearchTableHeader.displayName = "SearchTableHeader";

export default SearchTableHeader;
