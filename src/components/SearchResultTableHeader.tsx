import { memo, useMemo } from "react";

const HEADER_CELL_STYLE = {
  fontFamily: "var(--chakra-fonts-heading)",
  fontWeight: "var(--chakra-fontWeights-bold)",
  textTransform: "uppercase" as const,
  letterSpacing: "var(--chakra-letterSpacings-wider)",
  textAlign: "start" as const,
  paddingInlineStart: "var(--chakra-space-6)",
  paddingInlineEnd: "var(--chakra-space-6)",
  paddingTop: "var(--chakra-space-3)",
  paddingBottom: "var(--chakra-space-3)",
  lineHeight: "var(--chakra-lineHeights-4)",
  fontSize: "var(--chakra-fontSizes-xs)",
  color: "var(--chakra-colors-gray-600)",
  borderBottom: "1px solid var(--chakra-colors-gray-100)",
};

const SearchResultTableHeader = memo(() => {
  const cellStyles = useMemo(
    () => ({
      과목코드: { ...HEADER_CELL_STYLE, width: "100px" },
      학년: { ...HEADER_CELL_STYLE, width: "50px" },
      과목명: { ...HEADER_CELL_STYLE, width: "200px" },
      학점: { ...HEADER_CELL_STYLE, width: "50px" },
      전공: { ...HEADER_CELL_STYLE, width: "150px" },
      시간: { ...HEADER_CELL_STYLE, width: "150px" },
      빈칸: { ...HEADER_CELL_STYLE, width: "80px" },
    }),
    []
  );

  return (
    <thead>
      <tr>
        <th style={cellStyles.과목코드}>과목코드</th>
        <th style={cellStyles.학년}>학년</th>
        <th style={cellStyles.과목명}>과목명</th>
        <th style={cellStyles.학점}>학점</th>
        <th style={cellStyles.전공}>전공</th>
        <th style={cellStyles.시간}>시간</th>
        <th style={cellStyles.빈칸}></th>
      </tr>
    </thead>
  );
});

export default SearchResultTableHeader;
