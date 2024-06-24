import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { ReactQueryProvider } from "./lib/react-query-provider.tsx";
import Router from "./routes/router.tsx";
import { LanguageProvider } from "./context/language-context.tsx";

function App() {
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
