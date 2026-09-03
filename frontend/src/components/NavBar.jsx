import {Container, Flex, Text, HStack, Button} from "@chakra-ui/react";
import {CiSquarePlus} from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";
import {CiLogout} from "react-icons/ci";
import {Link, Link as RouterLink, useNavigate} from "react-router-dom";
import {useColorMode} from "./ui/color-mode";
import {IoMoonSharp} from "react-icons/io5";
import {FaSun} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice.js";

function NavBar() {
  const {colorMode, toggleColorMode} = useColorMode();
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.role === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <>
      <Container maxW={"1140px"} px={"4"}>
        <Flex
          h={"16"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDir={{base: "column", sm: "row"}}
        >
          <Text
            fontSize={{base: "22px", sm: "28px"}}
            fontWeight="bold"
            textTransform="uppercase"
            textAlign="center"
            color="blue.500"
          >
            <Link as={RouterLink} to="/">
              Product Store 🛒
            </Link>
          </Text>
          <HStack spacing={2} alignItems={"center"}>
            {isAdmin &&(
              <Link to="/create">
              <Button>
                <CiSquarePlus fontSize={20} />
              </Button>
            </Link>
            )}

            {currentUser ? (
              <>
                <Link to="/profile">
                  <Button variant="outline">
                    {currentUser.name || "Profile"}
                  </Button>
                </Link>
                <Button onClick={handleLogout} aria-label="Logout">
                  <CiLogout fontSize={20} />
                </Button>
              </>
            ) : (
              <Link to="/account">
                <Button aria-label="Sign in" variant="outline">
                  <FiUserPlus fontSize={20} /> Sign in
                </Button>
              </Link>
            )}

            <Button onClick={toggleColorMode} aria-label="Toggle color mode">
              {colorMode === "light" ? <IoMoonSharp /> : <FaSun size="20" />}
            </Button>
          </HStack>
        </Flex>
      </Container>
    </>
  );
}

export default NavBar;
