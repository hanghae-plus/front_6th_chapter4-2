import React, { ReactNode, useContext, useState } from 'react';

interface DragStateContextType {
  activeTableId: string | null;
  isDragging?: boolean;
  setActiveTableId: (id: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const DragStateContext = React.createContext<DragStateContextType | undefined>(
  undefined
);

export const DragStateProvider = ({ children }: { children: ReactNode }) => {
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragStateContext.Provider
      value={{
        activeTableId,
        isDragging,
        setActiveTableId,
        setIsDragging,
      }}
    >
      {children}
    </DragStateContext.Provider>
  );
};

export const useDragState = () => {
  const context = useContext(DragStateContext);
  if (!context) throw new Error('드래그 콘텍스트 없음');

  return context;
};
