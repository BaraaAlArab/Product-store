import {Container, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import {useEffect} from "react";
import {Link} from "react-router-dom";
import {useProductStore} from "../store/product.js";
import ProductCard from "../components/card/productCard.jsx";
function HomePage() {
  const {fetchProducts, products} = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Container maxW={`container.xl`} py={12}>
      <VStack spacing={8}>
        <Text
          fontSize="30px"
          fontWeight={"bold"}
          color={"blue.500"}
          textAlign={"center"}
        >
          Current Product
        </Text>
        <SimpleGrid columns={{base: 1, md: 2}} spacing={10} w={"full"}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>
        {products.length === 0 && (
          <Text
            fontSize={`xl`}
            textAlign={"center"}
            fontWeight={"bold"}
            color={"gray.500"}
          >
            no product found 😢{""}
            <Link to={"/Create"}>
              {" "}
              {""}
              <Text
                as="span"
                color={"blue.500"}
                _hover={{textDecoration: "underline"}}
              >
                Create a Product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
}

export default HomePage;
