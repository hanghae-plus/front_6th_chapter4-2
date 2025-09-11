import { memo } from "react";
import { Text } from "@chakra-ui/react";

interface SearchResultCountProps {
  count: number;
}

// 검색 결과 수 컴포넌트
const SearchResultCount = ({ count }: SearchResultCountProps) => {
  return <Text align="right">검색결과: {count}개</Text>;
};

SearchResultCount.displayName = "SearchResultCount";

export default memo(SearchResultCount);
