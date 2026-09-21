import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
  Badge,
} from "@chakra-ui/react";
import {toaster} from "../ui/toaster";
import {MdDelete} from "react-icons/md";
import {CiEdit} from "react-icons/ci";
import {HiOutlineShoppingBag, HiOutlineSparkles} from "react-icons/hi2";
import React, {useState} from "react";
import {useProductStore} from "../../store/product.js";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function ProductCard({product}) {
  const {DeleteProduct, UpdateProduct} = useProductStore();
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setUpdatedProduct(product); // reset to current product values on open
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteProduct = async (pid) => {
    const {success, message} = await DeleteProduct(pid);
    toaster.create({
      title: success ? "Product deleted." : "Error deleting product.",
      description: message || (success ? "Your product was successfully deleted." : "Something went wrong."),
      type: success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const {success, message} = await UpdateProduct(pid, updatedProduct);
    closeModal();
    toaster.create({
      title: success ? "Product updated." : "Error updating product",
      description: message || (success ? "Your product was successfully updated." : "Something went wrong."),
      type: success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      toaster.create({
        title: "Sign in required",
        description: "Please sign in to place an order.",
        type: "warning",
        duration: 4000,
        isClosable: true,
      });
      navigate("/account");
      return;
    }
    navigate(`/checkout/${product._id}`);
  };

  const {currentUser} = useSelector((state) => state.user);
  const isAdmin = currentUser?.role === "admin";

  return (
    <Box
      className="product-card"
      rounded="2xl"
      overflow="hidden"
      bg="#fff"
      _dark={{bg: "gray.900", borderColor: "gray.800"}}
      border="1px solid"
      borderColor="gray.100"
      h="full"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" overflow="hidden">
        <Image
          src={product.image}
          alt={product.name}
          h={56}
          w="full"
          objectFit="cover"
          className="product-image"
        />
        {product.stock > 0 ? (
          <Badge
            position="absolute"
            top={3}
            left={3}
            colorScheme="green"
            rounded="full"
            px={2}
          >
            ● {product.stock} in stock
          </Badge>
        ) : (
          <Badge
            position="absolute"
            top={3}
            left={3}
            colorScheme="red"
            rounded="full"
            px={2}
          >
            Out of stock
          </Badge>
        )}
        {product.category && (
          <Badge
            position="absolute"
            top={3}
            right={3}
            rounded="full"
            px={2}
            bg="white"
            _dark={{bg: "gray.800"}}
            color="gray.600"
            textTransform="uppercase"
            fontSize="xs"
          >
            {product.category}
          </Badge>
        )}
      </Box>

      <Box p={5} flex="1" display="flex" flexDirection="column">
        <Heading as="h3" size="md" mb={2} fontFamily="var(--font-heading)" noOfLines={1}>
          {product.name}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4} noOfLines={2} flex="1">
          {product.description || "No description available."}
        </Text>

        <Flex align="baseline" gap={2} mb={4}>
          <Text fontWeight="800" fontSize="2xl" className="gradient-text">
            ${product.price}
          </Text>
          {product.oldPrice > 0 && product.oldPrice > product.price && (
            <Text fontSize="sm" color="gray.400" textDecoration="line-through">
              ${product.oldPrice}
            </Text>
          )}
        </Flex>

        {isAdmin ? (
          <HStack spacing={2} w="full">
            <Button variant="outline" size="sm" flex="1" onClick={openModal}>
              <Icon as={CiEdit} boxSize={4} /> Edit
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              flex="1"
              onClick={() => handleDeleteProduct(product._id)}
            >
              <Icon as={MdDelete} boxSize={4} /> Delete
            </Button>
          </HStack>
        ) : (
          <Button
            className="btn-gradient"
            width="100%"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            rounded="xl"
          >
            <Icon as={HiOutlineShoppingBag} boxSize={4} />
            {product.stock > 0 ? "Buy Now" : "Out of Stock"}
          </Button>
        )}
      </Box>

      {/* Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={(e) => (e.open ? null : closeModal())}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                <HStack>
                  <Icon as={HiOutlineSparkles} color="teal.400" />
                  <Text>Update Product</Text>
                </HStack>
              </Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={4}>
                <Input
                  placeholder="Product Name"
                  name="name"
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({...updatedProduct, name: e.target.value})
                  }
                />
                <Input
                  placeholder="Price"
                  name="price"
                  type="number"
                  value={updatedProduct.price}
                  onChange={(e) =>
                    setUpdatedProduct({...updatedProduct, price: e.target.value})
                  }
                />
                <Input
                  placeholder="Old price (before discount)"
                  name="oldPrice"
                  type="number"
                  value={updatedProduct.oldPrice ?? ""}
                  onChange={(e) =>
                    setUpdatedProduct({...updatedProduct, oldPrice: e.target.value})
                  }
                />
                <Input
                  placeholder="Image URL"
                  name="image"
                  value={updatedProduct.image}
                  onChange={(e) =>
                    setUpdatedProduct({...updatedProduct, image: e.target.value})
                  }
                />
                <Input
                  placeholder="Category"
                  name="category"
                  value={updatedProduct.category || ""}
                  onChange={(e) =>
                    setUpdatedProduct({...updatedProduct, category: e.target.value})
                  }
                />
                <Input
                  placeholder="Stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={updatedProduct.stock ?? 0}
                  onChange={(e) =>
                    setUpdatedProduct({...updatedProduct, stock: e.target.value})
                  }
                />
                <Box w="full">
                  <Textarea
                    placeholder="Description"
                    name="description"
                    value={updatedProduct.description || ""}
                    onChange={(e) =>
                      setUpdatedProduct({...updatedProduct, description: e.target.value})
                    }
                  />
                </Box>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button className="btn-gradient" mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>
                Update
              </Button>
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}