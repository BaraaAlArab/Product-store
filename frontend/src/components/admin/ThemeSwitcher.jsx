import {Box, Flex, Icon, NativeSelect, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {HiOutlinePaintBrush} from "react-icons/hi2";
import {toaster} from "../ui/toaster.jsx";
import {
  EVENT_THEMES,
  applyEventTheme,
  fetchEventTheme,
  saveEventTheme,
  currentEventTheme,
} from "../../theme/eventThemes.js";

function ThemeSwitcher() {
  const [value, setValue] = useState("default");

  useEffect(() => {
    fetchEventTheme()
      .then((theme) => {
        applyEventTheme(theme);
        setValue(theme);
      })
      .catch(() => setValue(currentEventTheme()));
  }, []);

  const handleChange = async (e) => {
    const id = e.target.value;
    applyEventTheme(id); // apply instantly as a preview
    setValue(id);
    try {
      const result = await saveEventTheme(id, localStorage.getItem("token"));
      toaster.create({title: result.message || "Theme updated", type: "success", duration: 3000});
    } catch {
      toaster.create({title: "Failed to save theme", description: "Reverting to the saved theme.", type: "error", duration: 4000});
      try {
        const saved = await fetchEventTheme();
        applyEventTheme(saved);
        setValue(saved);
      } catch {
        /* keep preview if even the fetch fails */
      }
    }
  };

  return (
    <Box p={5} rounded="2xl" bg="white" _dark={{bg: "gray.900", borderColor: "gray.800"}} border="1px solid" borderColor="gray.100" w="full">
      <Flex align="center" gap={2} mb={3}>
        <Flex boxSize="34px" rounded="lg" align="center" justify="center" bg="indigo.50" color="indigo.500" _dark={{bg: "indigo.950", color: "indigo.300"}}>
          <Icon as={HiOutlinePaintBrush} />
        </Flex>
        <Box>
          <Text fontWeight="700" fontSize="sm">Site-wide event theme</Text>
          <Text fontSize="xs" color="gray.500">Applies to every visitor — guests and clients too.</Text>
        </Box>
      </Flex>

      <NativeSelect.Root maxW={{base: "full", sm: "320px"}}>
        <NativeSelect.Field
          value={value}
          onChange={handleChange}
          rounded="xl"
          bg="white"
          _dark={{bg: "gray.900"}}
        >
          {EVENT_THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  );
}

export default ThemeSwitcher;