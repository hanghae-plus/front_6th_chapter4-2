import { Button, Td, Tr } from "@chakra-ui/react";
import { memo } from "react";
import type { Lecture } from "../types";

interface Props extends Lecture {
	index: number;
	addSchedule: (lecture: Lecture) => void;
}

export const LectureRow = memo(({ index, addSchedule, ...lecture }: Props) => {
	const { id, grade, title, credits, major, schedule } = lecture;

	return (
		<Tr>
			<Td width="100px">{id}</Td>
			<Td width="50px">{grade}</Td>
			<Td width="200px">{title}</Td>
			<Td width="50px">{credits}</Td>
			<Td
				width="150px"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: dangerouslySetInnerHTML 쓰는 이유 확인 하기
				dangerouslySetInnerHTML={{ __html: major }}
			/>
			<Td
				width="150px"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: dangerouslySetInnerHTML 쓰는 이유 확인 하기
				dangerouslySetInnerHTML={{ __html: schedule }}
			/>
			<Td width="80px">
				<Button
					size="sm"
					colorScheme="green"
					onClick={() => addSchedule(lecture)}
				>
					추가
				</Button>
			</Td>
		</Tr>
	);
});
