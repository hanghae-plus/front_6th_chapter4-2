import { useState } from "react";

type SearchInfo = {
  tableId: string;
  day?: string;
  time?: number;
};

export function useSearchInfo() {
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  return { searchInfo, setSearchInfo };
}
