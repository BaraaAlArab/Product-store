import {Button, Container, Heading, Input, Textarea, VStack} from "@chakra-ui/react";
import {toaster} from "../components/ui/toaster.jsx";
import {useColorModeValue} from "../components/ui/color-mode";

import {useState} from "react";
import {useProductStore} from "../store/product.js";

function CreatePage() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const {createProduct} = useProductStore();

  const handleAddProduct = async () => {
    const numericPrice = Number(newProduct.price);
    const numericStock = newProduct.stock === "" ? 0 : Number(newProduct.stock);

    const {success, message} = await createProduct({
      ...newProduct,
      price: numericPrice,
      stock: numericStock,
    });

    if (success) {
      toaster.create({
        title: "Product created.",
        description: message || "Your product was successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setNewProduct({name: "", price: "", image: "", description: "", category: "", stock: ""});
    } else {
      toaster.create({
        title: "Error creating product.",
        description: message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddClick = async () => {
    setSubmitting(true);
    try {
      await handleAddProduct();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Create new Product
        </Heading>
        <VStack
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
          spacing={4}
        >
          <Input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({...newProduct, name: e.target.value})
            }
          />
          <Input
            type="number"
            placeholder="Product price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({...newProduct, price: e.target.value})
            }
          />
          <Input
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({...newProduct, image: e.target.value})
            }
          />
          <Input
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({...newProduct, category: e.target.value})
            }
          />
          <Input
            type="number"
            min="0"
            placeholder="Stock (units available)"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({...newProduct, stock: e.target.value})
            }
          />
          <Textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({...newProduct, description: e.target.value})
            }
          />
          <Button colorScheme="blue" onClick={handleAddClick} w="full" loading={submitting}>
            Add Product
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}

export default CreatePage;
