import "@fontsource/averia-serif-libre/300.css";
import "@fontsource/averia-serif-libre/400.css";
import "@fontsource/average/400.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
