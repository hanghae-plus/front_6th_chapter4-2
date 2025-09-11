import { useAutoCallback } from "./useAutoCallback";
import { SearchOption } from "../types";

export const useSearchHandlers = (
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void
) => {
  const handleQueryChange = useAutoCallback((value: SearchOption["query"]) => {
    changeSearchOption("query", value);
  });

  const handleCreditsChange = useAutoCallback(
    (value: SearchOption["credits"]) => {
      changeSearchOption("credits", value);
    }
  );

  const handleDaysChange = useAutoCallback((value: SearchOption["days"]) => {
    changeSearchOption("days", value);
  });

  const handleGradesChange = useAutoCallback(
    (value: SearchOption["grades"]) => {
      changeSearchOption("grades", value);
    }
  );

  const handleTimesChange = useAutoCallback((value: SearchOption["times"]) => {
    changeSearchOption("times", value);
  });

  const handleMajorsChange = useAutoCallback(
    (value: SearchOption["majors"]) => {
      changeSearchOption("majors", value);
    }
  );

  return {
    handleQueryChange,
    handleCreditsChange,
    handleDaysChange,
    handleGradesChange,
    handleTimesChange,
    handleMajorsChange,
  };
};
