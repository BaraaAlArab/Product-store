import { useEffect, useState } from "react";
import { Box, Button, Heading, VStack, HStack, Image, Text } from "@chakra-ui/react";
import { useColorModeValue } from "../../components/ui/color-mode";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const cardBg = useColorModeValue("white", "gray.800");

  if (loading) return <Text p={6}>Loading...</Text>;

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <HStack gap={6} mb={8}>
        {user?.avatar ? (
          <Image
            src={user.avatar}
            rounded="full"
            boxSize="24"
            objectFit="cover"
            border="1px"
          />
        ) : (
          <Box
            boxSize="24"
            rounded="full"
            border="1px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="3xl">{user?.name?.[0]?.toUpperCase() || "?"}</Text>
          </Box>
        )}
        <Box>
          <Heading size="lg">{user?.name || "User"}</Heading>
          <Text color="gray.500" capitalize>
            {user?.role || "Client"}
          </Text>
        </Box>
      </HStack>

      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={6}
      >
        <Box bg={cardBg} p={6} rounded="lg" shadow="md">
          <Heading size="md" mb={4}>
            Profile Information
          </Heading>
          <Text>
            <strong>Name:</strong> {user?.name || "-"}
          </Text>
          <Text>
            <strong>Email:</strong> {user?.email || "-"}
          </Text>
          <Text>
            <strong>Phone:</strong> {user?.telephone || "-"}
          </Text>
          <Text>
            <strong>DOB:</strong>{" "}
            {user?.DOB ? new Date(user.DOB).toLocaleDateString() : "-"}
          </Text>
        </Box>

        <Box bg={cardBg} p={6} rounded="lg" shadow="md">
          <Heading size="md" mb={4}>
            Security
          </Heading>
          <VStack align="stretch" spacing={3}>
            <Button>Change Password</Button>
            <Button>Enable 2FA</Button>
            <Button colorScheme="red" variant="outline">
              Deactivate Account
            </Button>
          </VStack>
        </Box>

        <Box
          bg={cardBg}
          p={6}
          rounded="lg"
          shadow="md"
          gridColumn={{ md: "1 / -1" }}
        >
          <Heading size="md" mb={4}>
            Purchase History
          </Heading>
          <Text color="gray.500">No purchases yet.</Text>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfilePage;
