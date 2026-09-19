import {Container, Heading, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router-dom";

function StorePage() {
  return (
    <Container maxW="container.xl" py={12} className="anim-fade-in-up">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl">
          Purchase Page
        </Heading>
        <Text fontSize="lg" color="gray.500">
          This is the purchase page content.
        </Text>
        <Text color="blue.500">
          <Link to="/">Back to store</Link>
        </Text>
      </VStack>
    </Container>
  );
}

export default StorePage;