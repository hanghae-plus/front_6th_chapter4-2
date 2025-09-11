import { Thead, Tr, Th } from "@chakra-ui/react";
import { memo } from "react";
import SearchItem from "./SearchItem.tsx";

const SearchTableHead = memo(() => (
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
));

SearchItem.displayName = "SearchTableHead";
export default SearchTableHead;