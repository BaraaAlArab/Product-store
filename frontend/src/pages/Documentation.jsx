import {Box, Container, Heading, Icon, Text, VStack, Flex} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineUserGroup,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineBookOpen,
} from "react-icons/hi2";

const sections = [
  {
    icon: HiOutlineUserGroup,
    title: "Creating an account",
    body: "Click Sign in in the top bar, then Create one. Provide your name, phone, email and a strong password (min 8 chars, uppercase + number).",
  },
  {
    icon: HiOutlineShoppingBag,
    title: "Placing an order",
    body: "Browse products on the home page. Click Buy Now on any item, fill in your shipping details, and confirm. The item's stock is checked in real time.",
  },
  {
    icon: HiOutlineTruck,
    title: "Tracking an order",
    body: "After checkout you receive a tracking number. Use the Track Order page (or the navbar Track link) any time to see the delivery progress.",
  },
  {
    icon: HiOutlineMagnifyingGlass,
    title: "Search & filters",
    body: "Use the search box to find products by name, and the category dropdown to narrow results. Both work together instantly.",
  },
  {
    icon: HiOutlineBookOpen,
    title: "Admin management",
    body: "Admins can add products from the + Add button, edit and delete items from any product card, and manage users from the Admin dashboard.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Password recovery",
    body: "Forgot your password? Use the Forgot password link under Sign in. You'll get a reset link to set a new password.",
  },
];

function DocumentationPage() {
  return (
    <Container maxW="container.lg" py={12} className="anim-fade-in-up">
      <VStack spacing={10}>
        <VStack spacing={3} textAlign="center">
          <Heading fontFamily="var(--font-heading)" size="2xl">
            <span className="gradient-text">Documentation</span>
          </Heading>
          <Text color="gray.500" maxW="lg">
            Everything you need to know about using the Product Store — from your first sign in to tracking deliveries.
          </Text>
        </VStack>

        <Flex wrap="wrap" gap={6} justify="center">
          {sections.map((s, i) => (
            <Box
              key={s.title}
              w={{base: "full", md: "46%"}}
              p={6}
              rounded="2xl"
              bg="white"
              _dark={{bg: "gray.900", borderColor: "gray.800"}}
              border="1px solid"
              borderColor="gray.100"
              className="product-card stagger-item"
              style={{animationDelay: `${0.1 + i * 0.05}s`}}
            >
              <Flex gap={3} align="center" mb={3}>
                <Flex boxSize="44px" rounded="xl" align="center" justify="center" bg="indigo.50" color="indigo.500" _dark={{bg: "indigo.950", color: "indigo.300"}}>
                  <Icon as={s.icon} boxSize={5} />
                </Flex>
                <Heading as="h3" size="md" fontFamily="var(--font-heading)">{s.title}</Heading>
              </Flex>
              <Text color="gray.600" _dark={{color: "gray.300"}} fontSize="sm">{s.body}</Text>
            </Box>
          ))}
        </Flex>

        <Text color="gray.500">
          Still need help?{" "}
          <Link to="/contact" style={{color: "#6366f1", fontWeight: 600}}>Contact support</Link>
        </Text>
      </VStack>
    </Container>
  );
}

export default DocumentationPage;