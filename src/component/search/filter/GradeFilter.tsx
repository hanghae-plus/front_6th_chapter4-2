import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from "@chakra-ui/react"
import { SearchOption } from "../../../types.ts"
import { memo } from "react"

type GradeFilterProps = {
  grades: SearchOption["grades"]
  changeSearchOption: (field: keyof SearchOption, value: SearchOption[typeof field]) => void
}

const GradeFilter = ({ grades, changeSearchOption }: GradeFilterProps) => {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup value={grades} onChange={(value) => changeSearchOption("grades", value.map(Number))}>
        <HStack spacing={4}>
          {[1, 2, 3, 4].map((grade) => (
            <Checkbox key={grade} value={grade}>
              {grade}학년
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  )
}

GradeFilter.displayName = "GradeFilter"

export default memo(GradeFilter)
