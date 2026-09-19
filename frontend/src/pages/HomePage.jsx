import {
  Button,
  Container,
  Flex,
  Input,
  NativeSelect,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
  Box,
  Icon,
} from "@chakra-ui/react";
import {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {useProductStore} from "../store/product.js";
import ProductCard from "../components/card/ProductCard.jsx";
import AdsBanner from "../components/AdsBanner.jsx";
import NewArrivalsScroller from "../components/NewArrivalsScroller.jsx";
import {HiOutlineSparkles, HiOutlineMagnifyingGlass} from "react-icons/hi2";

function HomePage() {
  const {fetchProducts, products, loading} = useProductStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query || product.name.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const hasFilters = searchQuery.trim() !== "" || selectedCategory !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={12}>
        {/* Hero */}
        <Box
          className="hero-gradient anim-fade-in-up"
          w="full"
          px={{base: 6, md: 12}}
          py={{base: 12, md: 20}}
          textAlign="center"
        >
          <VStack spacing={6}>
            <Flex
              alignItems="center"
              gap={2}
              color="indigo.400"
              fontWeight="medium"
              fontSize="sm"
              className="anim-fade-in-up"
            >
              <Icon as={HiOutlineSparkles} boxSize={4} />
              <Text>Curated picks, delivered fast</Text>
            </Flex>

            <Text
              fontSize={{base: "36px", md: "56px"}}
              fontWeight="800"
              fontFamily="var(--font-heading)"
              lineHeight="1.1"
              className="gradient-text anim-fade-in-up"
              textAlign="center"
              style={{animationDelay: "0.1s"}}
            >
              Buy your favorite products here
            </Text>

            <Text
              fontSize={{base: "md", md: "lg"}}
              color="gray.500"
              maxW="2xl"
              className="anim-fade-in-up"
              style={{animationDelay: "0.2s"}}
            >
              Discover hand-picked electronics, clothing, and more — all in one
              place.
            </Text>

            {/* Search + Filter */}
            <Flex
              w="full"
              flexDir={{base: "column", sm: "row"}}
              gap={3}
              maxW="640px"
              mx="auto"
              className="anim-fade-in-up"
              style={{animationDelay: "0.3s"}}
            >
              <Box position="relative" w={{base: "full", sm: "full"}} flex="1">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  pl="40px"
                  rounded="xl"
                  bg="white"
                  shadow="md"
                  _dark={{bg: "gray.900"}}
                />
                <Icon
                  as={HiOutlineMagnifyingGlass}
                  position="absolute"
                  left="3"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                />
              </Box>

              <NativeSelect.Root w={{base: "full", sm: "180px"}}>
                <NativeSelect.Field
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  rounded="xl"
                  bg="white"
                  shadow="md"
                  _dark={{bg: "gray.900"}}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>

              <Button
                className="btn-gradient"
                onClick={clearFilters}
                disabled={!hasFilters}
                rounded="xl"
              >
                Clear
              </Button>
            </Flex>
          </VStack>
        </Box>

        {/* Ads + new arrivals scroller */}
        {!loading && products.length > 0 && (
          <>
            <AdsBanner />
            <NewArrivalsScroller products={products} />
          </>
        )}

        {/* Product grid */}
        {loading ? (
          <SimpleGrid columns={{base: 1, sm: 2, lg: 3, xl: 4}} spacing={{base: 6, md: 10}} w="full">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height="280px" rounded="2xl" className="shimmer" />
            ))}
          </SimpleGrid>
        ) : filteredProducts.length > 0 ? (
          <SimpleGrid columns={{base: 1, sm: 2, lg: 3, xl: 4}} spacing={{base: 6, md: 10}} w="full">
            {filteredProducts.map((product) => (
              <Box key={product._id} className="stagger-item">
                <ProductCard product={product} />
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <VStack spacing={4} className="anim-scale-in">
            <Text fontSize="xl" textAlign="center" fontWeight="bold" color="gray.500">
              {products.length === 0
                ? "No products yet."
                : "No products match your search or filters."}
            </Text>
            {products.length > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear search & filters
              </Button>
            )}
            {products.length === 0 && (
              <Link to="/StorePage">
                <Text as="span" className="gradient-text" fontWeight="bold" _hover={{textDecoration: "underline"}}>
                  Go to store
                </Text>
              </Link>
            )}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}

export default HomePage;