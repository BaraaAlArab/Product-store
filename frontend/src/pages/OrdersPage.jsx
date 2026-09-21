import {Box, Button, Container, Heading, Text, VStack, Flex, Badge, Spinner, Separator, Icon} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {HiOutlineTruck, HiOutlineShoppingBag} from "react-icons/hi2";

const statusColor = {
  pending: "gray",
  processing: "blue",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("/api/orders/my-orders", {
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((res) => (res.ok ? res.json() : {orders: []}))
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, [token]);

  return (
    <Container maxW="container.lg" py={12} className="anim-fade-in-up">
      <VStack spacing={8} align="stretch">
        <Heading fontFamily="var(--font-heading)" textAlign="center">
          <span className="gradient-text">My Orders</span>
        </Heading>

        {orders === null ? (
          <Flex justify="center" gap={3} align="center" color="gray.500">
            <Spinner /> <Text>Loading orders…</Text>
          </Flex>
        ) : orders.length === 0 ? (
          <Flex direction="column" align="center" gap={3} py={10} className="anim-scale-in">
            <Icon as={HiOutlineShoppingBag} boxSize={12} color="gray.300" />
            <Text color="gray.500">You have no orders yet.</Text>
            <Link to="/">
              <Button className="btn-gradient" rounded="xl">Start shopping</Button>
            </Link>
          </Flex>
        ) : (
          <VStack spacing={5} align="stretch">
            {orders.map((order) => (
              <Box key={order._id} p={{base: 4, sm: 6}} rounded="2xl" bg="white" _dark={{bg: "gray.900", borderColor: "gray.800"}} border="1px solid" borderColor="gray.100">
                <Flex justify="space-between" wrap="wrap" gap={3} mb={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Order placed</Text>
                    <Text fontWeight="medium">{new Date(order.createdAt).toLocaleDateString()}</Text>
                  </Box>
                  <Box textAlign={{base: "left", sm: "right"}}>
                    <Text fontSize="sm" color="gray.500">Tracking #</Text>
                    <Text fontWeight="bold" fontFamily="var(--font-heading)" color="teal.500">
                      {order.trackingNumber}
                    </Text>
                  </Box>
                  <Badge colorScheme={statusColor[order.status] || "gray"} rounded="full" px={3} py={1} alignSelf="center">
                    {order.status}
                  </Badge>
                </Flex>

                {order.items.map((item) => (
                  <Flex key={item._id} gap={4} align="center" p={3} rounded="lg" bg="gray.50" _dark={{bg: "whiteAlpha.50"}} mb={2}>
                    <Box bgImage={`url(${item.image})`} bgSize="cover" bgPosition="center" boxSize="48px" rounded="md" flexShrink={0} />
                    <Box flex="1">
                      <Text fontWeight="600">{item.name}</Text>
                      <Text fontSize="sm" color="gray.500">Qty {item.quantity} × ${item.price}</Text>
                    </Box>
                    <Text fontWeight="bold">${item.price * item.quantity}</Text>
                  </Flex>
                ))}

                <Separator my={3} />
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">Total</Text>
                  <Flex gap={4} align="center">
                    <Text fontWeight="800" fontSize="lg" className="gradient-text">${order.total}</Text>
                    <Link to={`/track/${order.trackingNumber}`}>
                      <Button size="sm" variant="outline" leftIcon={<Icon as={HiOutlineTruck} />}>
                        Track
                      </Button>
                    </Link>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}

export default OrdersPage;