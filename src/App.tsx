import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { ReactQueryProvider } from "./lib/react-query-provider.tsx";
import Router from "./routes/router.tsx";
import { LanguageProvider } from "./context/language-context.tsx";
import { useEffect } from "react";
import { populateDataToCache } from "./lib/utils.ts";
import { validateJSONSchema } from "./lib/validate-response.ts";

function App() {
  useEffect(() => {
    const populateCache = async () => {
      await populateDataToCache();
    };
    populateCache();
    validateJSONSchema()
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
