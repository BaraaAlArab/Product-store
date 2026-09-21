import {Box} from "@chakra-ui/react";
import {Route, Routes} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import NavBar from "./components/NavBar.jsx";
import EventScenery from "./components/EventScenery.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CreateAccount from "./pages/Accounts/CreateAccount.jsx";
import Admin from "./pages/Admin.jsx";
import Client from "./pages/Client.jsx";
import Account from "./pages/Accounts/Account.jsx"
import StorePage from "./pages/StorePage.jsx";
import ProfilePage from "./pages/Accounts/ProfilePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";
import ForgotPasswordPage from "./pages/Accounts/ForgotPassword.jsx";
import ResetPasswordPage from "./pages/Accounts/ResetPassword.jsx";
import DocumentationPage from "./pages/Documentation.jsx";
import ContactPage from "./pages/Contact.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import {loginSuccess} from "./redux/userSlice.js";
import {initEventTheme} from "./theme/eventThemes.js";

function App() {
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user);

  // Apply the admin-selected site-wide event theme for every visitor
  useEffect(() => {
    initEventTheme();
  }, []);

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
      <Box minH={"100vh"} className="app-shell">
        <EventScenery />
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
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/track/:trackingNumber" element={<TrackOrderPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
