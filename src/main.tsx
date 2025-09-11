/**
 * React 애플리케이션의 엔트리 포인트
 * Chakra UI 테마를 적용하고 App 컴포넌트를 렌더링합니다.
 */
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
