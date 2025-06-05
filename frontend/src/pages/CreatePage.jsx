import {Box, Button, Container, Heading, Input, VStack} from "@chakra-ui/react";
import {useColorModeValue} from "../components/ui/color-mode";

import {useState} from "react";

function CreatePage() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });
  const handleAddProduct = () => {
    
  };
  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2x1"} textAlign={"center"} mb={8}>
          Create new Product
        </Heading>
        <Box
          w={"full"}
          bg={useColorModeValue("White", "gray.800")}
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
