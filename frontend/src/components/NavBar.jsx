import {Container, Flex, Text, HStack, Button} from "@chakra-ui/react";
import {CiSquarePlus} from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";
import {Link, Link as RouterLink} from "react-router-dom";
import {useColorMode} from "./ui/color-mode";
import {IoMoonSharp} from "react-icons/io5";
import {FaSun} from "react-icons/fa";

function NavBar() {
  const {ColorMode, toggleColorMode} = useColorMode();

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
            <Link to="/Create">
              <Button>
                <CiSquarePlus fontSize={20} />
              </Button>
            </Link>
            <Link to="/CreateAccount">
              <Button>
                <FiUserPlus fontSize={20} />
              </Button>
            </Link>
            <Button onClick={toggleColorMode}>
              {ColorMode === "light" ? <IoMoonSharp /> : <FaSun size="20" />}
            </Button>
          </HStack>
        </Flex>
      </Container>
    </>
  );
}

export default NavBar;
