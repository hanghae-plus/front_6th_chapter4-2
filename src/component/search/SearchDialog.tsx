import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import {
  Box,
  HStack,
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
} from "@chakra-ui/react"
import { useScheduleActions } from "../../provider/ScheduleContext.tsx"
import { Lecture } from "../../types.ts"
import { parseSchedule } from "../../utils.ts"
import axios, { AxiosResponse } from "axios"
import SearchItem from "./SearchItem.tsx"
import { useAutoCallback } from "../../hooks/useAutoCallback.ts"
import SearchTableHead from "./SearchTableHead.tsx"
import MajorFilter from "./filter/MajorFilter.tsx"
import DayFilter from "./filter/DayFilter.tsx"
import GradeFilter from "./filter/GradeFilter.tsx"
import PeriodTimeFilter from "./filter/PeriodTimeFilter.tsx"
import CreditFilter from "./filter/CreditFilter.tsx"
import QueryFilter from "./filter/QueryFilter.tsx"
import { SearchOption } from "../../types.ts"

interface Props {
  searchInfo: {
    tableId: string
    day?: string
    time?: number
  } | null
  onClose: () => void
}

const PAGE_SIZE = 100
const base = process.env.NODE_ENV === "production" ? "/front_6th_chapter4-2/" : "/"

const fetchMajors = () => axios.get<Lecture[]>(`${base}schedules-majors.json`)
const fetchLiberalArts = () => axios.get<Lecture[]>(`${base}schedules-liberal-arts.json`)

let majorsCache: Promise<AxiosResponse<Lecture[]>> | null = null
let liberalArtsCache: Promise<AxiosResponse<Lecture[]>> | null = null

const fetchAllLectures = async () => {
  if (!majorsCache) {
    majorsCache = fetchMajors().catch((error) => {
      majorsCache = null
      throw error
    })
  }
  if (!liberalArtsCache) {
    liberalArtsCache = fetchLiberalArts().catch((error) => {
      liberalArtsCache = null
      throw error
    })
  }

  const [majors, liberalArts] = await Promise.all([majorsCache, liberalArtsCache])

  return Promise.all([
    (console.log("API Call 1", performance.now()), majors),
    (console.log("API Call 2", performance.now()), liberalArts),
    (console.log("API Call 3", performance.now()), majors),
    (console.log("API Call 4", performance.now()), liberalArts),
    (console.log("API Call 5", performance.now()), majors),
    (console.log("API Call 6", performance.now()), liberalArts),
  ])
}

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleActions()

  const loaderWrapperRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [page, setPage] = useState(1)
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  })

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions
    return lectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase()),
      )
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0) {
          return true
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : []
        return schedules.some((s) => days.includes(s.day))
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : []
        return schedules.some((s) => s.range.some((time) => times.includes(time)))
      })
  }, [lectures, searchOptions])

  const lastPage = useMemo(() => Math.max(1, Math.ceil(filteredLectures.length / PAGE_SIZE)), [filteredLectures.length])
  const visibleLectures = useMemo(() => filteredLectures.slice(0, page * PAGE_SIZE), [filteredLectures, page])
  const allMajors = useMemo(() => [...new Set(lectures.map((l) => l.major))], [lectures])

  const changeSearchOption = useAutoCallback((field: keyof SearchOption, value: SearchOption[typeof field]) => {
    setPage(1)
    setSearchOptions((prev) => {
      if (prev[field] === value) return prev
      return { ...prev, [field]: value }
    })
    loaderWrapperRef.current?.scrollTo(0, 0)
  })

  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return

    const { tableId } = searchInfo

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }))

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }))

    onClose()
  })

  useEffect(() => {
    const start = performance.now()
    console.log("API 호출 시작: ", start)
    fetchAllLectures().then((results) => {
      const end = performance.now()
      console.log("모든 API 호출 완료 ", end)
      console.log("API 호출에 걸린 시간(ms): ", end - start)
      const [majors, liberalArts] = results
      setLectures([...majors.data, ...liberalArts.data])
    })
  }, [])

  // TODO 우선 다른 분 코드를 참고해서 수정한 것이니 꼭 제발 꼭 다시 공부하기
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setLoaderWrapperRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return // unmount 시 null 들어옴

      const $loader = loaderRef.current
      if (!$loader) return

      observerRef.current?.unobserve($loader)

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => Math.min(lastPage, prev + 1))
          }
        },
        { root: node },
      )

      observer.observe($loader)
      observerRef.current = observer
    },
    [lastPage],
  )

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }))
    setPage(1)
  }, [searchInfo])

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <QueryFilter query={searchOptions.query} changeSearchOption={changeSearchOption} />
              <CreditFilter credits={searchOptions.credits} changeSearchOption={changeSearchOption} />
            </HStack>

            <HStack spacing={4}>
              <GradeFilter grades={searchOptions.grades} changeSearchOption={changeSearchOption} />
              <DayFilter days={searchOptions.days} changeSearchOption={changeSearchOption} />
            </HStack>

            <HStack spacing={4}>
              <PeriodTimeFilter times={searchOptions.times} changeSearchOption={changeSearchOption} />
              <MajorFilter
                majors={searchOptions.majors}
                allMajors={allMajors}
                changeSearchOption={changeSearchOption}
              />
            </HStack>
            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <Box>
              <Table>
                <SearchTableHead />
              </Table>

              <Box overflowY="auto" maxH="500px" ref={setLoaderWrapperRef}>
                <Table size="sm" variant="striped">
                  <Tbody>
                    {visibleLectures.map((lecture, index) => (
                      <SearchItem key={`${lecture.id}-${index}`} lecture={lecture} addSchedule={addSchedule} />
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
  )
}

export default SearchDialog
