import {Box, Button, Container, Heading, Input, VStack} from "@chakra-ui/react";
import {toaster} from "../components/ui/toaster.jsx";
import {useColorModeValue} from "../components/ui/color-mode";

import {useState} from "react";
import {useProductStore} from "../store/product.js";

function CreatePage() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const {createProduct} = useProductStore();

  const handleAddProduct = async () => {
    const {success, message} = await createProduct(newProduct);

    if (success) {
      toaster.create({
        title: "Product created.",
        description: message || "Your product was successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Optionally clear form
      setNewProduct({name: "", price: "", image: ""});
    } else {
      toaster.create({
        title: "Error creating product.",
        description: message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setNewProduct({name: "", price: "", image: ""});
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Create new Product
        </Heading>
        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              type="text"
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({...newProduct, name: e.target.value})
              }
            />
            <Input
              type="number"
              placeholder="Product price"
              name="price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({...newProduct, price: e.target.value})
              }
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({...newProduct, image: e.target.value})
              }
            />
            <Button colorScheme="blue" onClick={handleAddProduct} w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default CreatePage;
