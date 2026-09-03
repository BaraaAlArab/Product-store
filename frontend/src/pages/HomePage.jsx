import {Container, SimpleGrid, Skeleton, Text, VStack} from "@chakra-ui/react";
import {useEffect} from "react";
import {Link} from "react-router-dom";
import {useProductStore} from "../store/product.js";
import ProductCard from "../components/card/ProductCard.jsx";

function HomePage() {
  const {fetchProducts, products, loading} = useProductStore();
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
          buy your favorite products here
        </Text>

        {loading ? (
          <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={10} w={"full"}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height="280px" rounded="2xl" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={10} w={"full"}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SimpleGrid>
        )}

        {!loading && products.length === 0 && (
          <Text
            fontSize={`xl`}
            textAlign={"center"}
            fontWeight={"bold"}
            color={"gray.500"}
          >
            No products yet.{" "}
            <Link to={"/StorePage"}>
              <Text as="span" color={"blue.500"} _hover={{textDecoration: "underline"}}>
                Go to store
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
}

export default HomePage;
