import {
	Box,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Table,
	Tbody,
	Text,
	VStack,
} from "@chakra-ui/react";
import axios, { type AxiosResponse } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAutoCallback } from "../hook/useAutoCallback.ts";
import { useScheduleContext } from "../ScheduleContext.tsx";
import type { Lecture } from "../types.ts";
import { parseSchedule } from "../utils.ts";
import { GradeDayFilters } from "./GradeDayFilters.tsx";
import { LectureRow } from "./LectureRow.tsx";
import { SearchInputFilters } from "./SearchInputFilters.tsx";
import { TableHeader } from "./TableHeader.tsx";
import { TimeMajorFilters } from "./TimeMajorFilters.tsx";

interface Props {
	searchInfo: {
		tableId: string;
		day?: string;
		time?: number;
	} | null;
	onClose: () => void;
}

export interface SearchOption {
	query?: string;
	grades: number[];
	days: string[];
	times: number[];
	majors: string[];
	credits?: number;
}

const PAGE_SIZE = 100;

const createApiCache = () => {
	const cache = new Map<string, Promise<AxiosResponse<Lecture[], unknown>>>();

	return (url: string) => {
		const cached = cache.get(url);
		if (cached) {
			return cached;
		}

		const result = axios.get<Lecture[]>(url);
		cache.set(url, result);
		return result;
	};
};

const apiCahce = createApiCache();

const fetchMajors = () => apiCahce("/schedules-majors.json");
const fetchLiberalArts = () => apiCahce("/schedules-liberal-arts.json");

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () =>
	await Promise.all([
		(console.log("API Call 1", performance.now()), fetchMajors()),
		(console.log("API Call 2", performance.now()), fetchLiberalArts()),
		(console.log("API Call 3", performance.now()), fetchMajors()),
		(console.log("API Call 4", performance.now()), fetchLiberalArts()),
		(console.log("API Call 5", performance.now()), fetchMajors()),
		(console.log("API Call 6", performance.now()), fetchLiberalArts()),
	]);

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
	const { setSchedulesMap } = useScheduleContext();

	const loaderWrapperRef = useRef<HTMLDivElement>(null);
	const loaderRef = useRef<HTMLDivElement>(null);
	const [lectures, setLectures] = useState<Lecture[]>([]);
	const [page, setPage] = useState(1);
	const [searchOptions, setSearchOptions] = useState<SearchOption>({
		query: "",
		grades: [],
		days: [],
		times: [],
		majors: [],
	});

	const { filteredLectures, lastPage, allMajors } = useMemo(() => {
		const { query = "", credits, grades, days, times, majors } = searchOptions;
		const filteredLectures = lectures
			.filter(
				(lecture) =>
					lecture.title.toLowerCase().includes(query.toLowerCase()) ||
					lecture.id.toLowerCase().includes(query.toLowerCase()),
			)
			.filter(
				(lecture) => grades.length === 0 || grades.includes(lecture.grade),
			)
			.filter(
				(lecture) => majors.length === 0 || majors.includes(lecture.major),
			)
			.filter(
				(lecture) => !credits || lecture.credits.startsWith(String(credits)),
			)
			.filter((lecture) => {
				if (days.length === 0) {
					return true;
				}
				const schedules = lecture.schedule
					? parseSchedule(lecture.schedule)
					: [];
				return schedules.some((s) => days.includes(s.day));
			})
			.filter((lecture) => {
				if (times.length === 0) {
					return true;
				}
				const schedules = lecture.schedule
					? parseSchedule(lecture.schedule)
					: [];
				return schedules.some((s) =>
					s.range.some((time) => times.includes(time)),
				);
			});

		const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
		const allMajors = [...new Set(lectures.map((lecture) => lecture.major))];

		return {
			filteredLectures,
			lastPage,
			allMajors,
		};
	}, [lectures, searchOptions]);
	const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);

	const changeSearchOption = useAutoCallback(
		(field: keyof SearchOption, value: SearchOption[typeof field]) => {
			setPage(1);
			setSearchOptions((prev) => ({ ...prev, [field]: value }));
			loaderWrapperRef.current?.scrollTo(0, 0);
		},
	);

	const addSchedule = useAutoCallback((lecture: Lecture) => {
		if (!searchInfo) return;

		const { tableId } = searchInfo;

		const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
			...schedule,
			lecture,
		}));

		setSchedulesMap((prev) => ({
			...prev,
			[tableId]: [...prev[tableId], ...schedules],
		}));

		onClose();
	});

	useEffect(() => {
		const start = performance.now();
		console.log("API 호출 시작: ", start);
		fetchAllLectures().then((results) => {
			const end = performance.now();
			console.log("모든 API 호출 완료 ", end);
			console.log("API 호출에 걸린 시간(ms): ", end - start);
			setLectures(results.flatMap((result) => result.data));
		});
	}, []);

	useEffect(() => {
		const $loader = loaderRef.current;
		const $loaderWrapper = loaderWrapperRef.current;

		if (!$loader || !$loaderWrapper) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setPage((prevPage) => Math.min(lastPage, prevPage + 1));
				}
			},
			{ threshold: 0, root: $loaderWrapper },
		);

		observer.observe($loader);

		return () => observer.unobserve($loader);
	}, [lastPage]);

	useEffect(() => {
		setSearchOptions((prev) => ({
			...prev,
			days: searchInfo?.day ? [searchInfo.day] : [],
			times: searchInfo?.time ? [searchInfo.time] : [],
		}));
		setPage(1);
	}, [searchInfo]);

	return (
		<Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
			<ModalOverlay />
			<ModalContent maxW="90vw" w="1000px">
				<ModalHeader>수업 검색</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4} align="stretch">
						<SearchInputFilters
							query={searchOptions.query}
							credits={searchOptions.credits}
							onChange={changeSearchOption}
						/>

						<GradeDayFilters
							grades={searchOptions.grades}
							days={searchOptions.days}
							onChange={changeSearchOption}
						/>

						<TimeMajorFilters
							times={searchOptions.times}
							majors={searchOptions.majors}
							allMajors={allMajors}
							onChange={changeSearchOption}
						/>
						<Text align="right">검색결과: {filteredLectures.length}개</Text>
						<Box>
							<TableHeader />

							<Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
								<Table size="sm" variant="striped">
									<Tbody>
										{visibleLectures.map((lecture, index) => (
											<LectureRow
												key={`${lecture.id}-${index}`}
												index={index}
												addSchedule={addSchedule}
												{...lecture}
											/>
										))}
									</Tbody>
								</Table>
								<Box ref={loaderRef} h="20px" />
							</Box>
						</Box>
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default SearchDialog;
