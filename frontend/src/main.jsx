import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "./components/ui/provider";
import App from "./App.jsx";
<<<<<<< HEAD
import {BrowserRouter} from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
=======

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
>>>>>>> 5793afb7d5a906d63b8fdd3cdb70ebddee71e102
  </StrictMode>,
);
