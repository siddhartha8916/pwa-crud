import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { ReactQueryProvider } from "./lib/react-query-provider.tsx";
import Router from "./routes/router.tsx";

function App() {
  return (
    <ReactQueryProvider>
      <Router />
      <PWABadge />
    </ReactQueryProvider>
  );
}

export default App;
