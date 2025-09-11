import {
  Button,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
} from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  onConfirm: () => void;
}

/**
 * 삭제 확인 팝오버 컴포넌트
 * onConfirm 콜백이 동일하면 리렌더하지 않음
 */
export const DeleteConfirmation = memo(
  ({ onConfirm }: Props) => {
    return (
      <PopoverContent onClick={(event) => event.stopPropagation()}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text>강의를 삭제하시겠습니까?</Text>
          <Button colorScheme="red" size="xs" onClick={onConfirm}>
            삭제
          </Button>
        </PopoverBody>
      </PopoverContent>
    );
  },

  (prevProps, nextProps) => {
    return prevProps.onConfirm === nextProps.onConfirm;
  }
);

DeleteConfirmation.displayName = "DeleteConfirmation";
