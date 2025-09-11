import {
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	HStack,
} from "@chakra-ui/react";
import { memo } from "react";
import type { SearchOption } from "./SearchDialog.tsx";

interface Props extends Pick<SearchOption, "grades"> {
	onChange: (
		field: keyof SearchOption,
		value: SearchOption[typeof field],
	) => void;
}

export const GradeFilter = memo(
	({ grades, onChange }: Props) => {
		return (
			<FormControl>
				<FormLabel>학년</FormLabel>
				<CheckboxGroup
					value={grades}
					onChange={(value) => onChange("grades", value.map(Number))}
				>
					<HStack spacing={4}>
						{[1, 2, 3, 4].map((grade) => (
							<Checkbox key={grade} value={grade}>
								{grade}학년
							</Checkbox>
						))}
					</HStack>
				</CheckboxGroup>
			</FormControl>
		);
	},
	(prev, next) => {
		return JSON.stringify(prev) === JSON.stringify(next);
	},
);
