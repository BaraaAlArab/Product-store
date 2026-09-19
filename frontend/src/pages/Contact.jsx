import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Icon,
  Input,
  Text,
  Textarea,
  VStack,
  Flex,
} from "@chakra-ui/react";
import {useState} from "react";
import {toaster} from "../components/ui/toaster.jsx";
import {HiOutlineEnvelope, HiOutlineChatBubbleLeftRight} from "react-icons/hi2";

function ContactPage() {
  const [form, setForm] = useState({name: "", email: "", message: ""});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toaster.create({title: "Missing fields", description: "Please fill in all fields.", type: "error", duration: 4000});
      return;
    }
    setSubmitting(true);
    // Opens the user's email client pre-addressed to support
    const subject = encodeURIComponent(`[Product Store] Support request from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n--\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:support@productstore.example?subject=${subject}&body=${body}`;
    setSubmitting(false);
    toaster.create({title: "Opening your email app…", type: "info", duration: 3000});
  };

  return (
    <Container maxW="container.lg" py={12} className="anim-fade-in-up">
      <Flex flexDir={{base: "column", lg: "row"}} gap={10}>
        {/* Info side */}
        <Box flex="1" p={8} rounded="2xl" className="hero-gradient">
          <VStack spacing={6} align="stretch">
            <Heading fontFamily="var(--font-heading)" size="xl">
              <span className="gradient-text">Contact support</span>
            </Heading>
            <Text color="gray.600" _dark={{color: "gray.300"}}>
              Questions about an order, an account issue or a technical problem? We are here to help.
            </Text>

            <Flex gap={3} align="center">
              <Flex boxSize="44px" rounded="xl" align="center" justify="center" bg="white" color="indigo.500" shadow="md">
                <Icon as={HiOutlineEnvelope} boxSize={5} />
              </Flex>
              <Box>
                <Text fontWeight="bold" fontSize="sm">Email us</Text>
                <Text fontSize="sm" color="gray.500">support@productstore.example</Text>
              </Box>
            </Flex>

            <Flex gap={3} align="center">
              <Flex boxSize="44px" rounded="xl" align="center" justify="center" bg="white" color="indigo.500" shadow="md">
                <Icon as={HiOutlineChatBubbleLeftRight} boxSize={5} />
              </Flex>
              <Box>
                <Text fontWeight="bold" fontSize="sm">Response time</Text>
                <Text fontSize="sm" color="gray.500">Within 24 hours, Mon–Fri</Text>
              </Box>
            </Flex>
          </VStack>
        </Box>

        {/* Form side */}
        <Box flex="1.2" p={8} rounded="2xl" border="1px solid" borderColor="gray.200" _dark={{borderColor: "gray.700"}}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <Field.Root>
                <Field.Label mb={1}>Your name</Field.Label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
              </Field.Root>
              <Field.Root>
                <Field.Label mb={1}>Email</Field.Label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@domain.com" />
              </Field.Root>
              <Field.Root>
                <Field.Label mb={1}>Message</Field.Label>
                <Textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" rows={6} />
              </Field.Root>
              <Button className="btn-gradient" type="submit" rounded="xl" loading={submitting} loadingText="Opening…">
                Send message
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Container>
  );
}

export default ContactPage;