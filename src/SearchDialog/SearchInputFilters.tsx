import {
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
} from "@chakra-ui/react";
import { memo } from "react";
import type { SearchOption } from "./SearchDialog";

interface Props {
	searchOptions: SearchOption;
	onChange: (
		field: keyof SearchOption,
		value: SearchOption[typeof field],
	) => void;
}

export const SearchInputFilters = memo(({ searchOptions, onChange }: Props) => {
	return (
		<HStack spacing={4}>
			<FormControl>
				<FormLabel>검색어</FormLabel>
				<Input
					placeholder="과목명 또는 과목코드"
					value={searchOptions.query}
					onChange={(e) => onChange("query", e.target.value)}
				/>
			</FormControl>

			<FormControl>
				<FormLabel>학점</FormLabel>
				<Select
					value={searchOptions.credits}
					onChange={(e) => onChange("credits", e.target.value)}
				>
					<option value="">전체</option>
					<option value="1">1학점</option>
					<option value="2">2학점</option>
					<option value="3">3학점</option>
				</Select>
			</FormControl>
		</HStack>
	);
});
