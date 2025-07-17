import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import {useColorMode} from "../ui/color-mode";
import {toaster} from "../ui/toaster";
import {MdDelete} from "react-icons/md";
import {CiEdit} from "react-icons/ci";
import React, {useState} from "react";
import {useProductStore} from "../../store/product.js";

export default function ProductCard({product}) {
  const {DeleteProduct, UpdateProduct} = useProductStore();
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {colorMode} = useColorMode();

  const openModal = () => {
    setUpdatedProduct(product); // reset to current product values on open
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteProduct = async (pid) => {
    const {success, message} = await DeleteProduct(pid);
    if (success) {
      toaster.create({
        title: "Product deleted.",
        description: message || "Your product was successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toaster.create({
        title: "Error deleting product.",
        description: message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const {success, message} = await UpdateProduct(pid, updatedProduct);
    closeModal();
    if (!success) {
      toaster.create({
        title: "Error updating product",
        description: message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toaster.create({
        title: "Product updated.",
        description: message || "Your product was successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        shadow="lg"
        rounded="2xl"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{transform: "translateY(-5px)", shadow: "xl"}}
        w="100%"
        maxW="sm"
        p={4}
        m={4}
      >
        <Image src={product.image} alt={product.name} h={56} />
        <Box p={4}>
          <Heading as="h3" size="md" mb={2}>
            {product.name}
          </Heading>
          <Text fontWeight="bold" fontSize="xl" mb={4}>
            ${product.price}
          </Text>
          <HStack spacing={2}>
            <IconButton
              icon={<Icon as={CiEdit} boxSize={6} />}
              onClick={openModal}
              colorScheme="blue"
              aria-label="Edit product"
            />
            <IconButton
              icon={<Icon as={MdDelete} boxSize={6} />}
              onClick={() => handleDeleteProduct(product._id)}
              colorScheme="red"
              aria-label="Delete product"
            />
          </HStack>
        </Box>
      </Box>

      {/* Custom Modal */}
      {isModalOpen && (
        <div style={styles.overlay} onClick={closeModal}>
          <div
            style={{
              ...styles.modal,
              backgroundColor: colorMode === "dark" ? "#2D3748" : "white",
              color: colorMode === "dark" ? "white" : "black",
            }}
            onClick={(e) => e.stopPropagation()} // prevent close on modal click
          >
            <h2 style={{marginBottom: "1rem"}}>Update Product</h2>
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
                placeholder="Image URL"
                name="image"
                value={updatedProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({...updatedProduct, image: e.target.value})
                }
              />
            </VStack>
            <div style={{marginTop: "1.5rem", textAlign: "right"}}>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => handleUpdateProduct(product._id, updatedProduct)}
              >
                Update
              </Button>
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Simple CSS styles for the modal overlay and content
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    padding: "2rem",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
};
