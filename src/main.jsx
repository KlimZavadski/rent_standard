import "./themes/index.js";
import { hydrateConsentGlobals } from "./consent/consentStorage.js";
import { initGtagConsentStub } from "./consent/googleAnalytics.js";
import { registerOptionalConsentHooks } from "./consent/optionalScripts.js";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

hydrateConsentGlobals();
initGtagConsentStub();
registerOptionalConsentHooks();

createRoot(document.getElementById("root")).render(<App />);
