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
function searchProducts(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
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
        <div width={"full"} display={"flex"} justifyContent={"center"} mt={8}>
        <input type="text" placeholder="Search products..." onChange={(e) => searchProducts(e.target.value)} style={{padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "300px"}} />  
        <select name="" id="">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
        <input type="submit" value="Search" style={{padding: "8px 16px", marginLeft: "8px", borderRadius: "4px", border: "none", backgroundColor: "#3182ce", color: "#fff", cursor: "pointer"}} />
        
        </div>
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
