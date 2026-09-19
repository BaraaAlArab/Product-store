import {Flex, Text, HStack, Button} from "@chakra-ui/react";
import {CiSquarePlus} from "react-icons/ci";
import {FiUserPlus} from "react-icons/fi";
import {CiLogout} from "react-icons/ci";
import {HiOutlineTruck, HiOutlineBookOpen, HiOutlineChatBubbleLeftRight, HiOutlineShoppingBag} from "react-icons/hi2";
import {Link, useNavigate} from "react-router-dom";
import {useColorMode} from "./ui/color-mode";
import {IoMoonSharp} from "react-icons/io5";
import {FaSun} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../redux/userSlice.js";

function NavBar() {
  const {colorMode, toggleColorMode} = useColorMode();
  const {currentUser} = useSelector((state) => state.user);
  const isAdmin = currentUser?.role === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Flex
      as="nav"
      className="glass-nav anim-slide-down"
      px={{base: 4, md: 8}}
      alignItems="center"
      justifyContent="space-between"
      minH="64px"
      h={{base: "auto", sm: "16"}}
      flexDir={{base: "column", sm: "row"}}
      gap={{base: 2, sm: 0}}
    >
      <Text
        fontSize={{base: "22px", sm: "28px"}}
        fontWeight="bold"
        fontFamily="var(--font-heading)"
        textAlign="center"
      >
        <Link to="/">
          <span className="gradient-text">Product Store</span>{" "}
          <Text as="span" fontSize={{base: "16px", sm: "18px"}}>
            🛒
          </Text>
        </Link>
      </Text>

      <HStack spacing={2} alignItems="center">
        <Link to="/track">
          <Button variant="ghost" size="sm" aria-label="Track order">
            <HiOutlineTruck fontSize={18} />
          </Button>
        </Link>
        <Link to="/documentation">
          <Button variant="ghost" size="sm" aria-label="Documentation">
            <HiOutlineBookOpen fontSize={18} />
          </Button>
        </Link>
        <Link to="/contact">
          <Button variant="ghost" size="sm" aria-label="Contact support">
            <HiOutlineChatBubbleLeftRight fontSize={18} />
          </Button>
        </Link>

        {isAdmin && (
          <Link to="/create">
            <Button className="btn-gradient" size="sm">
              <CiSquarePlus fontSize={20} /> Add
            </Button>
          </Link>
        )}

        {currentUser ? (
          <>
            <Link to="/orders">
              <Button variant="ghost" size="sm" aria-label="My orders">
                <HiOutlineShoppingBag fontSize={18} />
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                {currentUser.name || "Profile"}
              </Button>
            </Link>
            <Button onClick={handleLogout} aria-label="Logout" variant="ghost" size="sm">
              <CiLogout fontSize={20} />
            </Button>
          </>
        ) : (
          <Link to="/account">
            <Button className="btn-gradient" size="sm">
              <FiUserPlus fontSize={20} /> Sign in
            </Button>
          </Link>
        )}

        <Button
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          variant="ghost"
          size="sm"
        >
          {colorMode === "light" ? <IoMoonSharp /> : <FaSun size="20" />}
        </Button>
      </HStack>
    </Flex>
  );
}

export default NavBar;