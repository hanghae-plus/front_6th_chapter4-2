import {
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	HStack,
} from "@chakra-ui/react";
import { memo } from "react";
import { DAY_LABELS } from "../constants.ts";
import type { SearchOption } from "./SearchDialog";

interface Props {
	searchOptions: SearchOption;
	onChange: (
		field: keyof SearchOption,
		value: SearchOption[typeof field],
	) => void;
}

export const GradeDayFilters = memo(({ searchOptions, onChange }: Props) => {
	return (
		<HStack spacing={4}>
			<FormControl>
				<FormLabel>학년</FormLabel>
				<CheckboxGroup
					value={searchOptions.grades}
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

			<FormControl>
				<FormLabel>요일</FormLabel>
				<CheckboxGroup
					value={searchOptions.days}
					onChange={(value) => onChange("days", value as string[])}
				>
					<HStack spacing={4}>
						{DAY_LABELS.map((day) => (
							<Checkbox key={day} value={day}>
								{day}
							</Checkbox>
						))}
					</HStack>
				</CheckboxGroup>
			</FormControl>
		</HStack>
	);
});
