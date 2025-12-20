import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ChakraProvider } from "./components/ui/provider";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/Store.js"; 
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ChakraProvider>
          <App />
          <Toaster />
        </ChakraProvider>
      </BrowserRouter>
    </ReduxProvider>
  </StrictMode>
);
