import {Box, Flex, Icon, Text, Badge} from "@chakra-ui/react";
import {HiOutlineFire, HiOutlineSparkles} from "react-icons/hi2";
import {Link} from "react-router-dom";

function NewArrivalsScroller({products}) {
  const highlights = products
    .map((p) => ({
      ...p,
      badge: p.onSale ? "SALE" : null,
      isNew: !p.onSale,
    }))
    .slice(0, 12);

  if (highlights.length === 0) return null;

  // Double the list for a seamless loop
  const loop = [...highlights, ...highlights];

  return (
    <Box
      w="full"
      rounded="2xl"
      border="1px solid"
      borderColor="gray.200"
      _dark={{borderColor: "gray.700"}}
      overflow="hidden"
      className="stagger-item"
    >
      <Flex align="center" gap={2} px={5} py={2} bg="gray.50" _dark={{bg: "gray.900", borderColor: "gray.700"}} borderBottom="1px solid" borderColor="gray.200">
        <Icon as={HiOutlineFire} color="orange.500" />
        <Text fontWeight="700" fontSize="sm" letterSpacing="wide">
          New arrivals & offers
        </Text>
      </Flex>

      <Box className="scroller-track" px={2} py={3}>
        <Flex className="scroller-inner" gap={3} w="max-content">
          {loop.map((product, i) => (
            <Link
              to={`/checkout/${product._id}`}
              key={`${product._id}-${i}`}
              style={{textDecoration: "none"}}
            >
              <Flex
                align="center"
                gap={3}
                bg="white"
                _dark={{bg: "gray.900", borderColor: "gray.800"}}
                rounded="xl"
                px={4}
                py={3}
                border="1px solid"
                borderColor="gray.100"
                _hover={{boxShadow: "0 8px 20px rgba(99,102,241,0.2)"}}
                transition="all 0.3s"
              >
                <Box
                  bgImage={`url(${product.image})`}
                  bgSize="cover"
                  bgPosition="center"
                  rounded="lg"
                  boxSize="48px"
                  flexShrink={0}
                />
                <Box>
                  <Flex align="center" gap={2}>
                    <Text fontWeight="600" fontSize="sm" maxW="140px" noOfLines={1}>
                      {product.name}
                    </Text>
                    {product.badge ? (
                      <Badge colorScheme="orange" rounded="full" fontSize="10px">SALE</Badge>
                    ) : (
                      <Badge colorScheme="green" rounded="full" fontSize="10px">
                        <Icon as={HiOutlineSparkles} /> NEW
                      </Badge>
                    )}
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Text fontWeight="800" fontSize="sm" color="indigo.500">
                      ${product.price}
                    </Text>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <Text fontSize="xs" color="gray.400" textDecoration="line-through">
                        ${product.oldPrice}
                      </Text>
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Link>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

export default NewArrivalsScroller;