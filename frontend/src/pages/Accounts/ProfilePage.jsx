import { useEffect, useState } from "react";
import { Box, Button, Heading, VStack, HStack, Image, Text, Badge, Separator } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const statusColor = {
  pending: "gray",
  processing: "blue",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
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
      .catch(() => setUser(null));

    fetch("/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Text p={6}>Loading...</Text>;

  return (
    <Box maxW="6xl" mx="auto" p={6} className="anim-fade-in-up">
      <HStack gap={6} mb={8} wrap="wrap">
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
            bg="white"
            _dark={{ bg: "gray.800" }}
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
        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} rounded="lg" shadow="md">
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

        <Box bg="white" _dark={{ bg: "gray.800" }} p={6} rounded="lg" shadow="md">
          <Heading size="md" mb={4}>
            Quick links
          </Heading>
          <VStack align="stretch" spacing={3}>
            <Link to="/track">
              <Button w="full" variant="outline">Track an order</Button>
            </Link>
            <Link to="/documentation">
              <Button w="full" variant="outline">Documentation</Button>
            </Link>
            <Link to="/contact">
              <Button w="full" variant="outline">Contact support</Button>
            </Link>
          </VStack>
        </Box>

        <Box
          bg="white"
          _dark={{ bg: "gray.800" }}
          p={6}
          rounded="lg"
          shadow="md"
          gridColumn={{ md: "1 / -1" }}
        >
          <Heading size="md" mb={4}>
            Purchase History
          </Heading>
          {orders.length === 0 ? (
            <Text color="gray.500">No purchases yet.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {orders.map((order) => (
                <Box key={order._id} p={4} rounded="lg" border="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
                  <HStack justify="space-between" mb={3} wrap="wrap" gap={2}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">#{order.trackingNumber}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Badge colorScheme={statusColor[order.status] || "gray"} rounded="full" px={2}>
                      {order.status}
                    </Badge>
                  </HStack>
                  {order.items.map((item) => (
                    <FlexRow key={item._id} item={item} />
                  ))}
                  <Separator my={3} />
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">Total</Text>
                    <Text fontWeight="bold">${order.total}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function FlexRow({ item }) {
  return (
    <HStack gap={3} mb={1}>
      <Box
        bgImage={`url(${item.image})`}
        bgSize="cover"
        bgPosition="center"
        boxSize="40px"
        rounded="md"
        flexShrink={0}
      />
      <Box flex="1">
        <Text fontSize="sm" fontWeight="600">{item.name}</Text>
        <Text fontSize="xs" color="gray.500">Qty {item.quantity}</Text>
      </Box>
      <Text fontSize="sm" fontWeight="600">${item.price * item.quantity}</Text>
    </HStack>
  );
}

export default ProfilePage;