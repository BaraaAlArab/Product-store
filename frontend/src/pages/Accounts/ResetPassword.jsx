import {Box, Button, Container, Heading, Input, Text, VStack} from "@chakra-ui/react";
import {useState} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {toaster} from "../../components/ui/toaster.jsx";

function ResetPasswordPage() {
  const {token} = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      toaster.create({
        title: "Weak password",
        description: "Password must be at least 8 characters with an uppercase letter and a number.",
        type: "error",
        duration: 5000,
      });
      return;
    }
    if (password !== confirm) {
      toaster.create({title: "Passwords do not match", type: "error", duration: 3000});
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/reset-password/${token}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({newPassword: password}),
      });
      const data = await res.json();
      if (!res.ok) {
        toaster.create({title: "Reset failed", description: data.message, type: "error", duration: 4000});
        return;
      }
      toaster.create({title: "Password reset!", description: "You can now sign in with your new password.", type: "success", duration: 5000});
      navigate("/account");
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
              <span className="gradient-text">Set a new password</span>
            </Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Choose a strong password you haven&apos;t used before.
            </Text>
          </VStack>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="white"
                _dark={{bg: "gray.900"}}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                bg="white"
                _dark={{bg: "gray.900"}}
              />
              <Button className="btn-gradient" type="submit" w="full" rounded="xl" loading={submitting} loadingText="Resetting…">
                Reset password
              </Button>
            </VStack>
          </form>
          <Text fontSize="sm" textAlign="center" color="gray.500">
            <Link to="/account" style={{color: "#6366f1", fontWeight: 600}}>Back to sign in</Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}

export default ResetPasswordPage;