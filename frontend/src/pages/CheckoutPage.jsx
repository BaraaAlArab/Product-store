import {
  Box,
  Button,
  Container,
  Field,
  Flex,
  Heading,
  Icon,
  Input,
  Separator,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {useProductStore} from "../store/product.js";
import {toaster} from "../components/ui/toaster.jsx";
import {HiOutlineShoppingBag, HiOutlineTruck} from "react-icons/hi2";

function CheckoutPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {fetchProducts, products, loading} = useProductStore();

  const [shipping, setShipping] = useState({name: "", address: "", city: "", phone: ""});
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  const product = products.find((p) => p._id === id);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setShipping({...shipping, [e.target.name]: e.target.value});
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.phone) {
      toaster.create({title: "Missing details", description: "Please fill in all shipping fields.", type: "error", duration: 4000});
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
        body: JSON.stringify({productId: id, quantity: 1, shipping}),
      });
      const data = await res.json();
      if (!res.ok) {
        toaster.create({title: "Order failed", description: data.message || "Something went wrong.", type: "error", duration: 4000});
        return;
      }
      toaster.create({title: "Order placed!", description: `Tracking: ${data.order.trackingNumber}`, type: "success", duration: 6000});
      navigate(`/track/${data.order.trackingNumber}`);
    } catch {
      toaster.create({title: "Order failed", description: "Network error. Please try again.", type: "error", duration: 4000});
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={16} className="anim-fade-in-up">
        <Flex justify="center" gap={3} align="center" color="gray.500">
          <Spinner size="lg" /> <Text>Loading checkout…</Text>
        </Flex>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxW="container.md" py={16} className="anim-fade-in-up">
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">Product not found.</Text>
          <Link to="/"><Button className="btn-gradient">Back to store</Button></Link>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={12} className="anim-fade-in-up">
      <Heading fontFamily="var(--font-heading)" mb={8}>
        <span className="gradient-text">Checkout</span>
      </Heading>

      <Flex flexDir={{base: "column", lg: "row"}} gap={8}>
        {/* Shipping form */}
        <Box flex="1.4" p={6} rounded="2xl" border="1px solid" borderColor="gray.200" _dark={{borderColor: "gray.700"}}>
          <Heading as="h3" size="md" mb={5} display="flex" alignItems="center" gap={2}>
            <Icon as={HiOutlineTruck} color="indigo.400" /> Shipping details
          </Heading>
          <form onSubmit={handlePlaceOrder}>
            <VStack spacing={4}>
              <Field.Root>
                <Field.Label mb={1}>Full name</Field.Label>
                <Input name="name" value={shipping.name} onChange={handleChange} placeholder="Jane Doe" />
              </Field.Root>
              <Field.Root>
                <Field.Label mb={1}>Street address</Field.Label>
                <Input name="address" value={shipping.address} onChange={handleChange} placeholder="123 Main St" />
              </Field.Root>
              <Flex w="full" gap={4} flexDir={{base: "column", sm: "row"}}>
                <Field.Root flex="1">
                  <Field.Label mb={1}>City</Field.Label>
                  <Input name="city" value={shipping.city} onChange={handleChange} placeholder="New York" />
                </Field.Root>
                <Field.Root flex="1">
                  <Field.Label mb={1}>Phone</Field.Label>
                    <Input name="phone" value={shipping.phone} onChange={handleChange} placeholder="+1 555-0100" />
                </Field.Root>
              </Flex>
              <Button className="btn-gradient" type="submit" w="full" rounded="xl" loading={placing} loadingText="Placing order…">
                <Icon as={HiOutlineShoppingBag} /> Place Order — ${product.price}
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Order summary */}
        <Box flex="1" p={6} rounded="2xl" className="hero-gradient">
          <Heading as="h3" size="md" mb={5} fontFamily="var(--font-heading)">
            Order summary
          </Heading>
          <Flex gap={4} align="center">
            <Box
              bgImage={`url(${product.image})`}
              bgSize="cover"
              bgPosition="center"
              rounded="xl"
              boxSize="80px"
            />
            <Box>
              <Text fontWeight="bold">{product.name}</Text>
              <Text fontSize="sm" color="gray.500">{product.category || "General"}</Text>
            </Box>
          </Flex>
          <Separator my={5} />
          <Flex justify="space-between" mb={2}>
            <Text color="gray.500">Subtotal</Text>
            <Text fontWeight="bold">${product.price}</Text>
          </Flex>
          <Flex justify="space-between" mb={2}>
            <Text color="gray.500">Shipping</Text>
            <Text fontWeight="bold" color="green.500">Free</Text>
          </Flex>
          <Separator my={4} />
          <Flex justify="space-between" mb={1}>
            <Text fontWeight="bold" fontSize="lg">Total</Text>
            <Text fontWeight="800" fontSize="xl" className="gradient-text">${product.price}</Text>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}

export default CheckoutPage;