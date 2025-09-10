import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useSchedules } from "../hook/useSchedules.ts";
import SearchDialog from "../SearchDialog/SearchDialog.tsx";
import Table from "./Table.tsx";

export const ScheduleTables = () => {
	const schedulesMap = useSchedules((state) => state.schedulesMap);

	const [searchInfo, setSearchInfo] = useState<{
		tableId: string;
		day?: string;
		time?: number;
	} | null>(null);

	const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

	return (
		<>
			<Flex w="full" gap={6} p={6} flexWrap="wrap">
				{Object.entries(schedulesMap).map(([tableId, schedules], index) => (
					<Table
						tableId={tableId}
						index={index}
						schedules={schedules}
						disabledRemoveButton={disabledRemoveButton}
						setSearchInfo={setSearchInfo}
					/>
				))}
			</Flex>
			<SearchDialog
				searchInfo={searchInfo}
				onClose={() => setSearchInfo(null)}
			/>
		</>
	);
};
