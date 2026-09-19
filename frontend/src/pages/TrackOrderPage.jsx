import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Input,
  Spinner,
  Text,
  VStack,
  Badge,
  Separator,
} from "@chakra-ui/react";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {toaster} from "../components/ui/toaster.jsx";
import {HiOutlineTruck, HiOutlineMagnifyingGlass, HiOutlineCheckCircle} from "react-icons/hi2";

const statusSteps = ["pending", "processing", "shipped", "delivered"];

const statusMeta = {
  pending: {color: "gray", label: "Order placed"},
  processing: {color: "blue", label: "Processing"},
  shipped: {color: "purple", label: "Shipped"},
  delivered: {color: "green", label: "Delivered"},
  cancelled: {color: "red", label: "Cancelled"},
};

function TrackOrderPage() {
  const {trackingNumber: paramTracking} = useParams();
  const [trackingNumber, setTrackingNumber] = useState(paramTracking || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!trackingNumber.trim()) {
      toaster.create({title: "Tracking number required", type: "error", duration: 3000});
      return;
    }
    setLoading(true);
    setSearched(true);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track/${trackingNumber.trim()}`);
      const data = await res.json();
      if (!res.ok) {
        toaster.create({title: "Not found", description: data.message || "No order with that tracking number.", type: "error", duration: 4000});
        return;
      }
      setOrder(data.order);
    } catch {
      toaster.create({title: "Track failed", description: "Network error. Please try again.", type: "error", duration: 4000});
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = order
    ? order.status === "cancelled"
      ? -1
      : statusSteps.indexOf(order.status) < 0
        ? 0
        : statusSteps.indexOf(order.status)
    : -1;

  return (
    <Container maxW="container.lg" py={12} className="anim-fade-in-up">
      <VStack spacing={10}>
        <Heading fontFamily="var(--font-heading)" textAlign="center">
          <span className="gradient-text">Track your order</span>
        </Heading>
        <Text color="gray.500" textAlign="center" maxW="md">
          Enter the tracking number you received after placing your order.
        </Text>

        <form onSubmit={handleTrack} style={{width: "100%", maxWidth: "480px"}}>
          <Flex gap={3}>
            <Box position="relative" flex="1">
              <Input
                placeholder="e.g. 636580D8"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                pl="40px"
                rounded="xl"
                bg="white"
                shadow="md"
                _dark={{bg: "gray.900"}}
              />
              <Icon as={HiOutlineMagnifyingGlass} position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.400" />
            </Box>
            <Button className="btn-gradient" type="submit" rounded="xl" loading={loading} loadingText="…">
              Track
            </Button>
          </Flex>
        </form>

        {loading && <Spinner size="lg" color="indigo.400" />}

        {!loading && order && (
          <Box w="full" p={{base: 4, sm: 6}} rounded="2xl" className="hero-gradient anim-fade-in-up">
            <Flex justify="space-between" align="center" wrap="wrap" gap={3} mb={4}>
              <Box>
                <Text fontSize="sm" color="gray.500">Tracking number</Text>
                <Text fontWeight="bold" fontFamily="var(--font-heading)">{order.trackingNumber}</Text>
              </Box>
              <Badge colorScheme={statusMeta[order.status]?.color || "gray"} rounded="full" px={3} py={1} fontSize="sm">
                {statusMeta[order.status]?.label || order.status}
              </Badge>
            </Flex>

            <Separator my={4} />

            {order.items.map((item) => (
              <Flex key={item._id} gap={4} align="center" p={3} rounded="lg" bg="blackAlpha.50" _dark={{bg: "whiteAlpha.50"}} mb={2}>
                <Box bgImage={`url(${item.image})`} bgSize="cover" bgPosition="center" rounded="md" boxSize="56px" />
                <Box flex="1">
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text fontSize="sm" color="gray.500">Qty {item.quantity} × ${item.price}</Text>
                </Box>
                <Text fontWeight="bold">${item.price * item.quantity}</Text>
              </Flex>
            ))}

            <Separator my={4} />

            <Flex justify="space-between" mb={4}>
              <Text color="gray.500">Shipped to</Text>
              <Text fontWeight="medium" textAlign="right">
                {order.shipping.name}, {order.shipping.address}, {order.shipping.city}
              </Text>
            </Flex>

            {order.status === "cancelled" ? (
              <Flex gap={2} align="center" color="red.500" fontWeight="bold">
                <Icon as={HiOutlineTruck} /> This order was cancelled.
              </Flex>
            ) : (
              <>
                <Text fontWeight="bold" mb={3} color="gray.500" fontSize="sm">Delivery progress</Text>
                <Flex align="center">
                  {statusSteps.map((step, i) => (
                    <Flex key={step} align="center" flex="1" direction={{base: "column", sm: "row"}}>
                      <Flex direction="column" align={{base: "center", sm: "flex-start"}} gap={1}>
                        <Flex
                          boxSize="32px"
                          rounded="full"
                          align="center"
                          justify="center"
                          bg={i <= stepIndex ? "indigo.500" : "gray.200"}
                          color="white"
                        >
                          <Icon as={HiOutlineCheckCircle} />
                        </Flex>
                        <Text
                          fontSize="xs"
                          fontWeight={i <= stepIndex ? "bold" : "normal"}
                          color={i <= stepIndex ? "indigo.500" : "gray.400"}
                          display={{base: "none", sm: "block"}}
                        >
                          {statusMeta[step].label}
                        </Text>
                      </Flex>
                      {i < statusSteps.length - 1 && (
                        <Box flex="1" h="2px" mx={2} mb={6} bg={i < stepIndex ? "indigo.500" : "gray.200"} />
                      )}
                    </Flex>
                  ))}
                </Flex>
              </>
            )}

            <Separator my={4} />
            <Flex justify="space-between">
              <Text fontWeight="bold" fontSize="lg">Total</Text>
              <Text fontWeight="800" fontSize="xl" className="gradient-text">${order.total}</Text>
            </Flex>
          </Box>
        )}

        {!loading && searched && !order && (
          <Text color="gray.500">No order found for that tracking number.</Text>
        )}
      </VStack>
    </Container>
  );
}

export default TrackOrderPage;