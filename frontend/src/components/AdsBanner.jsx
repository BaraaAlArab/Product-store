import {Box, Flex, Icon, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {HiOutlineSparkles, HiOutlineFire, HiOutlineTicket, HiOutlineGift} from "react-icons/hi2";

const ads = [
  {
    icon: HiOutlineSparkles,
    title: "New Arrivals",
    subtitle: "Fresh products just landed",
    bg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  {
    icon: HiOutlineFire,
    title: "Hot Deals",
    subtitle: "Limited-time offers this week",
    bg: "linear-gradient(135deg, #d946ef, #a855f7)",
  },
  {
    icon: HiOutlineTicket,
    title: "Free Shipping",
    subtitle: "On every order, no minimum",
    bg: "linear-gradient(135deg, #10b981, #059669)",
  },
  {
    icon: HiOutlineGift,
    title: "Members Rewards",
    subtitle: "Bonus points for loyal buyers",
    bg: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
];

function AdsBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ad = ads[index];

  return (
    <Box
      w="full"
      rounded="2xl"
      p={6}
      background={ad.bg}
      color="white"
      className="stagger-item"
      boxShadow="0 16px 40px -12px rgba(139,92,246,0.5)"
    >
      <Flex align="center" justify="space-between" gap={4} wrap="wrap">
        <Flex align="center" gap={4}>
          <Flex boxSize="52px" rounded="2xl" align="center" justify="center" bg="rgba(255,255,255,0.2)">
            <Icon as={ad.icon} boxSize={7} />
          </Flex>
          <Box>
            <Text fontWeight="800" fontSize={{base: "lg", md: "xl"}} fontFamily="var(--font-heading)">
              {ad.title}
            </Text>
            <Text fontSize="sm" opacity={0.9}>{ad.subtitle}</Text>
          </Box>
        </Flex>

        <Flex gap={2} mr={{base: 0, md: 4}}>
          {ads.map((_, i) => (
            <Box
              key={i}
              boxSize="8px"
              rounded="full"
              bg={i === index ? "white" : "rgba(255,255,255,0.4)"}
              cursor="pointer"
              transition="all 0.3s"
              onClick={() => setIndex(i)}
            />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}

export default AdsBanner;