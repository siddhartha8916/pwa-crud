import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { ReactQueryProvider } from "./lib/react-query-provider.tsx";
import Router from "./routes/router.tsx";
import { LanguageProvider } from "./context/language-context.tsx";
import { useEffect } from "react";
import { populateDataToCache } from "./lib/utils.ts";

function App() {
  useEffect(() => {
    const populateCache = async () => {
      await populateDataToCache();
    };
    populateCache();
  }, []);

  return (
    <ReactQueryProvider>
      <LanguageProvider>
        <Router />
      </LanguageProvider>
      <PWABadge />
    </ReactQueryProvider>
  );
}

export default App;
