import { useEffect } from 'react';

interface UseIntersectionObserverProps {
	onIntersect: () => void;
	loaderRef: React.RefObject<HTMLDivElement | null>;
	loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
	options?: IntersectionObserverInit;
}

export const useIntersectionObserver = ({
	onIntersect,
	loaderRef,
	loaderWrapperRef,
	options = {},
}: UseIntersectionObserverProps) => {
	const $loader = loaderRef.current;
	const $loaderWrapper = loaderWrapperRef.current;

	useEffect(() => {
		// 요소가 존재하지 않으면 종료
		if (!$loader || !$loaderWrapper) {
			return;
		}

		const observer = new IntersectionObserver(
			// entries - 관찰 중인 요소 배열
			(entries) => {
				if (entries[0].isIntersecting) {
					// loader 요소가 화면과 교차하면 페이지 증가
					onIntersect();
				}
			},
			{
				threshold: options.threshold, // 요소가 보이면 콜백 실행
				root: $loaderWrapper, // 관찰 기준 요소 지정
			}
		);

		observer.observe($loader); // 요소 관찰 시작

		return () => observer.unobserve($loader); // 컴포넌트 언마운트 시 해제
	}, [onIntersect, options, loaderRef, loaderWrapperRef]);
};

// useEffect(() => {
// 	const $loader = loaderRef.current;
// 	const $loaderWrapper = loaderWrapperRef.current;

// 	if (!$loader || !$loaderWrapper) {
// 		return;
// 	}

// 	const observer = new IntersectionObserver(
// 		(entries) => {
// 			if (entries[0].isIntersecting) {
// 				setPage((prevPage) => Math.min(lastPage, prevPage + 1));
// 			}
// 		},
// 		{ threshold: 0, root: $loaderWrapper }
// 	);

// 	observer.observe($loader);

// 	return () => observer.unobserve($loader);
// }, [lastPage]);
