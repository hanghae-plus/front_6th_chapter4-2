import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
);
