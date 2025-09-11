import React, { ReactNode, useContext, useMemo, useState } from 'react';

interface DragStateContextType {
  activeTableId: string | null;
  isDragging?: boolean;
}

interface DragActions {
  setActiveTableId: (id: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const DragStateContext = React.createContext<DragStateContextType | undefined>(
  undefined
);

const DragActionsContext = React.createContext<DragActions | undefined>(
  undefined
);

export const DragStateProvider = ({ children }: { children: ReactNode }) => {
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const actions = useMemo<DragActions>(
    () => ({
      setActiveTableId,
      setIsDragging,
    }),
    []
  );

  const value = useMemo<DragStateContextType>(
    () => ({
      activeTableId,
      isDragging,
      // setActiveTableId,
      // setIsDragging,
    }),
    [activeTableId, isDragging]
  );
  return (
    <DragActionsContext.Provider value={actions}>
      <DragStateContext.Provider value={value}>
        {children}
      </DragStateContext.Provider>
    </DragActionsContext.Provider>
  );
};

export const useDragState = () => {
  const state = useContext(DragStateContext);
  const actions = useContext(DragActionsContext);
  if (!state || !actions) throw new Error('드래그 콘텍스트 없음');

  return { ...state, ...actions };
};

export const useActiveTableId = () => {
  const state = useContext(DragStateContext);
  if (!state) {
    throw new Error('DragStateProvider 내부에서 사용해주세요');
  }
  return state.activeTableId;
};
