import { memo } from "react";
import { Lecture } from "../../types.ts";

interface Props {
  lecture: Lecture;
  addSchedule: (lecture: Lecture) => void;
  isEven?: boolean;
}

const SearchItem = ({ 
  addSchedule,
  lecture,
  isEven = false
}: Props) => {
  const { id, grade, title, credits, major, schedule } = lecture;

  return (
    <tr style={{
      backgroundColor: isEven ? '#f7fafc' : 'transparent',
      transition: 'background-color 0.2s'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = isEven ? '#f7fafc' : 'transparent'}
    >
      <td style={{ width: '100px', padding: '8px 12px' }}>{id}</td>
      <td style={{ width: '50px', padding: '8px 12px' }}>{grade}</td>
      <td style={{ width: '200px', padding: '8px 12px' }}>{title}</td>
      <td style={{ width: '50px', padding: '8px 12px' }}>{credits}</td>
      <td style={{ width: '150px', padding: '8px 12px' }} dangerouslySetInnerHTML={{ __html: major }} />
      <td style={{ width: '150px', padding: '8px 12px' }} dangerouslySetInnerHTML={{ __html: schedule }} />
      <td style={{ width: '80px', padding: '8px 12px' }}>
        <button 
          style={{
            fontSize: '14px',
            padding: '4px 12px',
            backgroundColor: '#48BB78',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#38A169'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#48BB78'}
          onClick={() => addSchedule(lecture)}
        >
          추가
        </button>
      </td>
    </tr>
  );
};
SearchItem.displayName = 'SearchItem';

export default memo(SearchItem, (prevProps, nextProps) => {
  const prevLecture = prevProps.lecture;
  const nextLecture = nextProps.lecture;

  return (
    prevLecture.id === nextLecture.id &&
    prevLecture.title === nextLecture.title &&
    prevLecture.grade === nextLecture.grade &&
    prevLecture.credits === nextLecture.credits &&
    prevLecture.major === nextLecture.major &&
    prevLecture.schedule === nextLecture.schedule &&
    prevProps.addSchedule === nextProps.addSchedule &&
    prevProps.isEven === nextProps.isEven
  );
});