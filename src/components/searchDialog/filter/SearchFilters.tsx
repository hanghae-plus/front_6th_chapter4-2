import { HStack } from "@chakra-ui/react";
import {
  QueryForm,
  CreditsForm,
  GradeForm,
  DayForm,
  TimeForm,
  MajorForm,
} from "./forms/index.ts";

export const SearchFilters = ({ allMajors }: { allMajors: string[] }) => {
  return (
    <>
      <HStack spacing={4}>
        <QueryForm />
        <CreditsForm />
      </HStack>

      <HStack spacing={4}>
        <GradeForm />
        <DayForm />
      </HStack>

      <HStack spacing={4}>
        <TimeForm />
        <MajorForm allMajors={allMajors} />
      </HStack>
    </>
  );
};
