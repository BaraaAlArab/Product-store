import {Box} from "@chakra-ui/react";
import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import {Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import {useColorModeValue} from "./components/ui/color-mode.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Create" element={<CreatePage />} />
          <Route path="/CreateAccount" element={<CreateAccount />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
