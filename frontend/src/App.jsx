import {Box} from "@chakra-ui/react";
import {Route, Routes} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import NavBar from "./components/NavBar.jsx";
import {useColorModeValue} from "./components/ui/color-mode.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CreateAccount from "./pages/Accounts/CreateAccount.jsx";
import Admin from "./pages/Admin.jsx";
import Client from "./pages/Client.jsx";
import Account from "./pages/Accounts/Account.jsx"
import StorePage from "./pages/StorePage.jsx";
import ProfilePage from "./pages/Accounts/ProfilePage.jsx";
import {loginSuccess} from "./redux/userSlice.js";

function App() {
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !currentUser) {
      fetch("/api/users/me", {
        headers: {Authorization: `Bearer ${token}`},
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((user) => {
          if (user) dispatch(loginSuccess({user, token}));
        })
        .catch(() => {});
    }
  }, [currentUser, dispatch]);

  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/StorePage" element={<StorePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/client" element={<Client />} />
         <Route path="/account" element={<Account />} />  
          
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
