import {Box} from "@chakra-ui/react";
import {Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import {useColorModeValue} from "./components/ui/color-mode.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Admin from "./pages/Admin.jsx";
import Client from "./pages/Client.jsx";
import Account from "./pages/Account.jsx"

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/client" element={<Client />} />
         <Route path="/account" element={<Account />} />  
        </Routes>
      </Box>
    </>
  );
}

export default App;
