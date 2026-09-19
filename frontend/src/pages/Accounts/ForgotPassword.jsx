import {Box, Button, Container, Heading, Input, Text, VStack} from "@chakra-ui/react";
import {useState} from "react";
import {Link} from "react-router-dom";
import {toaster} from "../../components/ui/toaster.jsx";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toaster.create({title: "Email required", type: "error", duration: 3000});
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email}),
      });
      const data = await res.json();
      if (!res.ok) {
        toaster.create({title: "Error", description: data.message, type: "error", duration: 4000});
      } else {
        setMessage(data.message);
        toaster.create({title: "Reset link sent", type: "success", duration: 4000});
      }
    } catch {
      toaster.create({title: "Network error", type: "error", duration: 4000});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxW="sm" py={20} className="anim-fade-in-up">
      <Box p={8} rounded="2xl" className="hero-gradient">
        <VStack spacing={5} align="stretch">
          <VStack spacing={2} align="center">
            <Heading fontFamily="var(--font-heading)" size="lg">
              <span className="gradient-text">Forgot password?</span>
            </Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Enter your email and we will send you a reset link.
            </Text>
          </VStack>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="white"
                _dark={{bg: "gray.900"}}
              />
              <Button className="btn-gradient" type="submit" w="full" rounded="xl" loading={submitting} loadingText="Sending…">
                Send reset link
              </Button>
            </VStack>
          </form>
          {message && (
            <Text fontSize="sm" color="green.500" textAlign="center">{message}</Text>
          )}
          <Text fontSize="sm" textAlign="center" color="gray.500">
            Remembered it?{" "}
            <Link to="/account" style={{color: "#6366f1", fontWeight: 600}}>Sign in</Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}

export default ForgotPasswordPage;