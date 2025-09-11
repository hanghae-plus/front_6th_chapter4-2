import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react";
import { DAY_LABELS } from "../../../constants.ts";
import { SearchOption } from "../../../types.ts";
import { memo } from "react";

type DayFilterProps = {
    days: SearchOption['days'];
    changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void;
}

const DayFilter = ({ days, changeSearchOption }: DayFilterProps) => {
    return (
        <FormControl>
            <FormLabel>요일</FormLabel>
            <CheckboxGroup
                value={days}
                onChange={(value) => changeSearchOption('days', value as string[])}
            >
                <HStack spacing={4}>
                    {DAY_LABELS.map(day => (
                        <Checkbox key={day} value={day}>{day}</Checkbox>
                    ))}
                </HStack>
            </CheckboxGroup>
        </FormControl>
    )
}

DayFilter.displayName="DayFilter";

export default memo(DayFilter);