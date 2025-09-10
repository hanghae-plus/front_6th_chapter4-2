import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack, HStack} from '@chakra-ui/react'
import SearchFilters from './components/SearchFilters.tsx'
import TimeFilter from './components/TimeFilter.tsx'
import MajorFilter from './components/MajorFilter.tsx'
import LectureTable from './components/LectureTable.tsx'
import {useSearchDialog} from './hooks/useSearchDialog.ts'

interface Props {
	searchInfo: {
		tableId: string
		day?: string
		time?: number
	} | null
	onClose: () => void
}

const SearchDialog = ({searchInfo, onClose}: Props) => {
	const {searchOptions, filteredLectures, visibleLectures, allMajors, loaderWrapperRef, loaderRef, addSchedule, handleQueryChange, handleCreditsChange, handleGradesChange, handleDaysChange, handleTimesChange, handleMajorsChange, handleTimeRemove, handleMajorRemove} = useSearchDialog({searchInfo, onClose})

	return (
		<Modal isOpen={Boolean(searchInfo)} onClose={onClose} size='6xl'>
			<ModalOverlay />
			<ModalContent maxW='90vw' w='1000px'>
				<ModalHeader>수업 검색</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4} align='stretch'>
						<SearchFilters searchOptions={searchOptions} onQueryChange={handleQueryChange} onCreditsChange={handleCreditsChange} onGradesChange={handleGradesChange} onDaysChange={handleDaysChange} />

						<HStack spacing={4}>
							<TimeFilter times={searchOptions.times} onTimesChange={handleTimesChange} onTimeRemove={handleTimeRemove} />

							<MajorFilter majors={searchOptions.majors} allMajors={allMajors} onMajorsChange={handleMajorsChange} onMajorRemove={handleMajorRemove} />
						</HStack>

						<Text align='right'>검색결과: {filteredLectures.length}개</Text>

						<LectureTable visibleLectures={visibleLectures} onAddSchedule={addSchedule} loaderWrapperRef={loaderWrapperRef as React.RefObject<HTMLDivElement>} loaderRef={loaderRef as React.RefObject<HTMLDivElement>} />
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default SearchDialog
