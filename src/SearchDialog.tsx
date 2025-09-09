import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
} from '@chakra-ui/react';
import axios from 'axios';
import { Lecture, SearchOption } from './types.ts';
import { PAGE_SIZE } from './constants.ts';
import { parseSchedule } from './utils.ts';
import { useIntersectionObserver } from './hooks/useIntersectionObserver.ts';
import SearchOptionFilter from './SearchOptionFilter.tsx';
import LectureHeadItem from './LectureHeadItem.tsx';
import LectureItem from './LectureItem.tsx';

interface Props {
	searchInfo: {
		tableId: string;
		day?: string;
		time?: number;
	} | null;
	onClose: () => void;
	addLecture: (lecture: Lecture) => void;
}

const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json'); // 전공 불러오기
const fetchLiberalArts = () => axios.get<Lecture[]>('/schedules-liberal-arts.json'); // 교양 불러오기

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
// (이미 호출한 api는 다시 호출하지 않도록 - 클로저를 이용하여 캐시 구성)
const fetchAllLectures = () => {
	let lectureCache: Lecture[] | null = null;

	return async () => {
		if (lectureCache) return lectureCache;

		const res = await Promise.all([
			(console.log('API Call 1', performance.now()), fetchMajors()),
			(console.log('API Call 2', performance.now()), fetchLiberalArts()),
			(console.log('API Call 3', performance.now()), fetchMajors()),
			(console.log('API Call 4', performance.now()), fetchLiberalArts()),
			(console.log('API Call 5', performance.now()), fetchMajors()),
			(console.log('API Call 6', performance.now()), fetchLiberalArts()),
		]);

		lectureCache = res.flatMap((r) => r.data);
		return lectureCache;
	};
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
// (스크롤을 할 때마다 검색을 시도하지 않도록)
const SearchDialog = ({ searchInfo, onClose, addLecture }: Props) => {
	const loaderWrapperRef = useRef<HTMLDivElement>(null);
	const loaderRef = useRef<HTMLDivElement>(null);
	const [lectures, setLectures] = useState<Lecture[]>([]);
	const [page, setPage] = useState(1);
	const [searchOptions, setSearchOptions] = useState<SearchOption>({
		query: '',
		grades: [],
		days: [],
		times: [],
		majors: [],
	});

	// 강의 필터링
	const filteredLectures = useMemo(() => {
		const { query = '', credits, grades, days, times, majors } = searchOptions;

		return lectures
			.filter(
				(lecture) =>
					lecture.title.toLowerCase().includes(query.toLowerCase()) ||
					lecture.id.toLowerCase().includes(query.toLowerCase())
			)
			.filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
			.filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
			.filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
			.filter((lecture) => {
				if (days.length === 0) {
					return true;
				}
				const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
				return schedules.some((s) => days.includes(s.day));
			})
			.filter((lecture) => {
				if (times.length === 0) {
					return true;
				}
				const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
				return schedules.some((s) => s.range.some((time) => times.includes(time)));
			});
	}, [lectures, searchOptions]);

	const lastPage = useMemo(() => Math.ceil(filteredLectures.length / PAGE_SIZE), [filteredLectures]);
	const visibleLectures = useMemo(() => filteredLectures.slice(0, page * PAGE_SIZE), [filteredLectures, page]);
	const allMajors = useMemo(() => [...new Set(lectures.map((lecture) => lecture.major))], [lectures]);

	const changeSearchOption = useCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
		setPage(1);
		setSearchOptions((prev) => ({ ...prev, [field]: value }));
		loaderWrapperRef.current?.scrollTo(0, 0); // 스크롤 위치를 맨 위로 이동
	}, []);

	useEffect(() => {
		const start = performance.now();
		console.log('API 호출 시작: ', start);

		fetchAllLectures()().then((results) => {
			const end = performance.now();
			console.log('모든 API 호출 완료 ', end);
			console.log('API 호출에 걸린 시간(ms): ', end - start);

			setLectures(results); // 전공과 교양을 평탄화하여 하나의 배열로 처리
		});
	}, []);

	// 무한 스크롤 IntersectionObserver 설정
	const handleNextPageScroll = useCallback(() => {
		setPage((prev) => Math.min(lastPage, prev + 1));
	}, [lastPage]);

	useIntersectionObserver({
		onIntersect: handleNextPageScroll,
		loaderRef: loaderRef,
		loaderWrapperRef: loaderWrapperRef,
	});

	// searchInfo 변경 시 검색 옵션 업데이트
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
						{/* 강의 옵션 필터링 */}
						<SearchOptionFilter
							searchOptions={searchOptions}
							allMajors={allMajors}
							changeSearchOption={changeSearchOption}
						/>

						<Text align="right">검색결과: {filteredLectures.length}개</Text>
						<Box>
							<LectureHeadItem />

							<Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
								<Table size="sm" variant="striped">
									{/* 필터링된 강의 목록 */}
									<Tbody>
										{visibleLectures.map((lecture, index) => (
											<LectureItem
												key={`${lecture.id}-${index}`}
												index={index}
												lecture={lecture}
												addLecture={addLecture}
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
