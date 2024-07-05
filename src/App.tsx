import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { ReactQueryProvider } from "./lib/react-query-provider.tsx";
import Router from "./routes/router.tsx";
import { LanguageProvider } from "./context/language-context.tsx";
import { useEffect } from "react";
import appSurveyApplicationInstance from "./lib/axios-instance/app-survey-axios-instance.ts";
import { getApplicationSecret } from "./lib/utils.ts";

function App() {
  useEffect(() => {
    const setCustomHeader = async () => {
      const customSecretHeader = await getApplicationSecret();
      appSurveyApplicationInstance.defaults.headers.common["X-Custom-Header"] =
        customSecretHeader;
    };

    setCustomHeader();
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
