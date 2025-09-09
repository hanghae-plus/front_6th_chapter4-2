import { DndContext, Modifier, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CellSize } from '../constants.ts';

// 드래그 스냅 함수
// 그리드에 맞춰 강의 스냅, 컨테이너 밖을 나가지 않도록 제한
function createSnapModifier(): Modifier {
	return ({ transform, containerNodeRect, draggingNodeRect }) => {
		const containerTop = containerNodeRect?.top ?? 0;
		const containerLeft = containerNodeRect?.left ?? 0;
		const containerBottom = containerNodeRect?.bottom ?? 0;
		const containerRight = containerNodeRect?.right ?? 0;

		const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

		const minX = containerLeft - left + 120 + 1;
		const minY = containerTop - top + 40 + 1;
		const maxX = containerRight - right;
		const maxY = containerBottom - bottom;

		return {
			...transform,
			x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
			y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
		};
	};
}

const modifiers = [createSnapModifier()];

interface ScheduleDndProviderProps {
	children: React.ReactNode;
	onDragStart?: (event: any) => void;
	onDragEnd?: (event: any) => void;
}

export default function ScheduleDndProvider({ children, onDragStart, onDragEnd }: ScheduleDndProviderProps) {
	const sensors = useSensors(
		// PointerSensor - 마우스나 터치 입력을 기준으로 드래그 감지
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // 8px 이상 움직여야 드래그 시작
			},
		})
	);

	return (
		<DndContext sensors={sensors} modifiers={modifiers} onDragStart={onDragStart} onDragEnd={onDragEnd}>
			{children}
		</DndContext>
	);
}
