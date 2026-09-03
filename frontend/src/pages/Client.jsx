import { Container, Text, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Client() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <Text fontSize="2xl" fontWeight="bold">
          Welcome, {currentUser?.name || "Client"}!
        </Text>
        <Text fontSize="lg" color="gray.500">
          Browse our products and find what you love.
        </Text>
        <Link to="/StorePage">
          <Text color="blue.500" _hover={{ textDecoration: "underline" }}>
            Go to Store
          </Text>
        </Link>
      </VStack>
    </Container>
  );
}

export default Client;
