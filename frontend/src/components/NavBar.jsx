import {Flex, Text, HStack, VStack, Button, IconButton, Box, Separator} from "@chakra-ui/react";
import {useState} from "react";
import {CiSquarePlus} from "react-icons/ci";
import {FiUserPlus} from "react-icons/fi";
import {CiLogout} from "react-icons/ci";
import {HiOutlineTruck, HiOutlineBookOpen, HiOutlineChatBubbleLeftRight, HiOutlineShoppingBag, HiOutlineChartBar, HiOutlineBars3, HiOutlineXMark} from "react-icons/hi2";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
    closeMenu();
  };

  const themeToggle = (
    <Button
      onClick={toggleColorMode}
      aria-label="Toggle color mode"
      variant="ghost"
      size="sm"
    >
      {colorMode === "light" ? <IoMoonSharp /> : <FaSun size="20" />}
    </Button>
  );

  return (
    <Flex
      as="nav"
      className="glass-nav anim-slide-down"
      flexDir="column"
      alignItems="stretch"
    >
      {/* Top row: logo + burger (mobile) / inline links (desktop) */}
      <Flex
        minH="64px"
        px={{base: 4, md: 8}}
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Text
          fontSize={{base: "22px", sm: "28px"}}
          fontWeight="bold"
          fontFamily="var(--font-heading)"
          textAlign="center"
        >
          <Link to="/" onClick={closeMenu}>
            <span className="gradient-text">Product Store</span>{" "}
            <Text as="span" fontSize={{base: "16px", sm: "18px"}}>
              🛒
            </Text>
          </Link>
        </Text>

        {/* Burger — mobile only */}
        <Box display={{base: "flex", md: "none"}}>
          <IconButton
            variant="ghost"
            size="md"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <HiOutlineXMark size={22} /> : <HiOutlineBars3 size={22} />}
          </IconButton>
        </Box>

        {/* Inline links — desktop only */}
        <HStack
          display={{base: "none", md: "flex"}}
          flexWrap="wrap"
          justifyContent="flex-end"
          gap={2}
          alignItems="center"
        >
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
            <>
              <Link to="/admin">
                <Button className="btn-gradient" size="sm" aria-label="Admin dashboard">
                  <HiOutlineChartBar fontSize={18} /> Dashboard
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="outline" size="sm">
                  <CiSquarePlus fontSize={20} /> Add
                </Button>
              </Link>
            </>
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

          {themeToggle}
        </HStack>
      </Flex>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <Box
          display={{base: "block", md: "none"}}
          px={4}
          pb={4}
          className="anim-fade-in-up"
          onClick={closeMenu}
        >
          <VStack align="stretch" spacing={1}>
            <Link to="/track">
              <Button variant="ghost" w="full" justifyContent="flex-start" size="sm">
                <HiOutlineTruck fontSize={18} /> Track order
              </Button>
            </Link>
            <Link to="/documentation">
              <Button variant="ghost" w="full" justifyContent="flex-start" size="sm">
                <HiOutlineBookOpen fontSize={18} /> Documentation
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" w="full" justifyContent="flex-start" size="sm">
                <HiOutlineChatBubbleLeftRight fontSize={18} /> Contact support
              </Button>
            </Link>

            {isAdmin && (
              <>
                <Separator my={1} />
                <Link to="/admin">
                  <Button className="btn-gradient" w="full" size="sm">
                    <HiOutlineChartBar size={18} /> Admin dashboard
                  </Button>
                </Link>
                <Link to="/create">
                  <Button variant="outline" w="full" size="sm">
                    <CiSquarePlus size={18} /> Add product
                  </Button>
                </Link>
              </>
            )}

            <Separator my={1} />

            {currentUser ? (
              <>
                <Link to="/orders">
                  <Button variant="ghost" w="full" justifyContent="flex-start" size="sm">
                    <HiOutlineShoppingBag fontSize={18} /> My orders
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" w="full" size="sm">
                    {currentUser.name || "Profile"}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" w="full" justifyContent="flex-start" size="sm">
                  <CiLogout fontSize={18} /> Logout
                </Button>
              </>
            ) : (
              <Link to="/account">
                <Button className="btn-gradient" w="full" size="sm">
                  <FiUserPlus fontSize={18} /> Sign in
                </Button>
              </Link>
            )}

            <Box display={{base: "flex", md: "none"}}>
              {themeToggle}
            </Box>
          </VStack>
        </Box>
      )}
    </Flex>
  );
}

export default NavBar;