import { useMemo } from 'react';
import { useDndContext } from '@dnd-kit/core';

/**
 * 특정 테이블이 현재 드래그 중인지 확인하는 최적화된 훅
 * - useDndContext 사용을 이 훅에 집중시켜 불필요한 구독 방지
 * - 해당 테이블이 드래그 중일 때만 true 반환
 */
export const useScheduleDrag = (tableId: string): boolean => {
  const dndContext = useDndContext();

  return useMemo(() => {
    const activeId = dndContext.active?.id;
    if (!activeId) return false;

    const activeTableId = String(activeId).split(':')[0];
    return activeTableId === tableId;
  }, [dndContext.active?.id, tableId]);
};

/**
 * 현재 드래그 중인 테이블 ID를 반환하는 훅
 * - 드래그 중이 아니면 null 반환
 */
export const useActiveDragTableId = (): string | null => {
  const dndContext = useDndContext();

  return useMemo(() => {
    const activeId = dndContext.active?.id;
    if (!activeId) return null;

    return String(activeId).split(':')[0];
  }, [dndContext.active?.id]);
};
