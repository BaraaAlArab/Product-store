<<<<<<< HEAD
import {Box} from "@chakra-ui/react";
import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import {Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import {useColorModeValue} from "./components/ui/color-mode.jsx";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Create" element={<CreatePage />} />
        </Routes>
      </Box>
=======
import {Button} from "./components/ui/Button.jsx";
function App() {
  return (
    <>
      <Button>Hello</Button>
>>>>>>> 5793afb7d5a906d63b8fdd3cdb70ebddee71e102
    </>
  );
}

export default App;
