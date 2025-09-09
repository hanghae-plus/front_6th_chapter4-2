import { HStack } from '@chakra-ui/react';
import { SearchOption } from '../../types.ts';
import CreditFilter from './CreditFilter.tsx';
import DayFilter from './DayFilter.tsx';
import GradeFilter from './GradeFilter.tsx';
import MajorFilter from './MajorFilter.tsx';
import QueryFilter from './QueryFilter.tsx';
import TimeFilter from './TimeFilter.tsx';

interface SearchOptionFilterProps {
	searchOptions: SearchOption;
	allMajors: string[];
	changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const SearchOptionFilter = ({ searchOptions, allMajors, changeSearchOption }: SearchOptionFilterProps) => {
	return (
		<>
			<HStack spacing={4}>
				{/* 검색 필터링 */}
				<QueryFilter query={searchOptions.query} changeSearchOption={changeSearchOption} />

				{/* 학점 필터링 */}
				<CreditFilter credits={searchOptions.credits} changeSearchOption={changeSearchOption} />
			</HStack>

			<HStack spacing={4}>
				{/* 학년 필터링 */}
				<GradeFilter grades={searchOptions.grades} changeSearchOption={changeSearchOption} />

				{/* 요일 필터링 */}
				<DayFilter days={searchOptions.days} changeSearchOption={changeSearchOption} />
			</HStack>

			<HStack spacing={4}>
				{/* 시간 필터링 */}
				<TimeFilter times={searchOptions.times} changeSearchOption={changeSearchOption} />

				{/* 전공 필터링 */}
				<MajorFilter majors={searchOptions.majors} allMajors={allMajors} changeSearchOption={changeSearchOption} />
			</HStack>
		</>
	);
};

export default SearchOptionFilter;
