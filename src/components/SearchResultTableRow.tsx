import { memo, useCallback, useContext, useMemo } from "react";
import { Lecture } from "../types";
import { SearchDialogContext } from "./SearchDialogContext";

interface Props {
  id: string;
  grade: number;
  title: string;
  credits: string;
  major: string;
  schedule: string;
}

const BASE_CELL_STYLE = {
  paddingInlineStart: "var(--chakra-space-4, 1rem)",
  paddingInlineEnd: "var(--chakra-space-4, 1rem)",
  paddingTop: "var(--chakra-space-2, 0.5rem)",
  paddingBottom: "var(--chakra-space-2, 0.5rem)",
  fontSize: "var(--chakra-fontSizes-sm, 0.875rem)",
  verticalAlign: "middle" as const,
  textAlign: "left" as const,
};

const BUTTON_STYLE = {
  transition: "all 0.15s ease",
  fontSize: "var(--chakra-fontSizes-sm, 0.875rem)",
  background: "var(--chakra-colors-green-500, #38A169)",
  color: "var(--chakra-colors-white, #FFFFFF)",
  paddingInlineStart: "var(--chakra-space-4, 1rem)",
  paddingInlineEnd: "var(--chakra-space-4, 1rem)",
  paddingTop: "var(--chakra-space-2, 0.5rem)",
  paddingBottom: "var(--chakra-space-2, 0.5rem)",
  borderRadius: "var(--chakra-radii-md, 0.375rem)",
} as const;

const SearchResultTableRow = memo(
  ({ id, grade, title, credits, major, schedule }: Props) => {
    const context = useContext(SearchDialogContext);

    const handleAddClick = useCallback(() => {
      if (!context) return;

      const lecture: Lecture = {
        id,
        grade,
        title,
        credits,
        major,
        schedule,
      };

      context.addSchedule(lecture);
    }, [context, id, grade, title, credits, major, schedule]);

    const cellStyles = useMemo(
      () => ({
        id: { ...BASE_CELL_STYLE, width: "100px" },
        grade: { ...BASE_CELL_STYLE, width: "50px" },
        title: { ...BASE_CELL_STYLE, width: "200px" },
        credits: { ...BASE_CELL_STYLE, width: "50px" },
        major: { ...BASE_CELL_STYLE, width: "150px" },
        schedule: { ...BASE_CELL_STYLE, width: "150px" },
        button: { ...BASE_CELL_STYLE, width: "80px" },
      }),
      []
    );

    return (
      <tr>
        <td style={cellStyles.id}>{id}</td>
        <td style={cellStyles.grade}>{grade}</td>
        <td style={cellStyles.title}>{title}</td>
        <td style={cellStyles.credits}>{credits}</td>
        <td
          style={cellStyles.major}
          dangerouslySetInnerHTML={{ __html: major }}
        />
        <td
          style={cellStyles.schedule}
          dangerouslySetInnerHTML={{ __html: schedule }}
        />
        <td style={cellStyles.button}>
          <button
            className="chakra-button"
            style={BUTTON_STYLE}
            onClick={handleAddClick}
          >
            추가
          </button>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.grade === nextProps.grade &&
      prevProps.title === nextProps.title &&
      prevProps.credits === nextProps.credits &&
      prevProps.major === nextProps.major &&
      prevProps.schedule === nextProps.schedule
    );
  }
);

export default SearchResultTableRow;
