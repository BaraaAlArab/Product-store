import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Badge,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster.jsx";
import ThemeSwitcher from "../components/admin/ThemeSwitcher.jsx";
import {
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineCog6Tooth,
  HiOutlineTruck,
} from "react-icons/hi2";

const orderStatus = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusMeta = {
  pending: { color: "gray", next: "processing", label: "Confirm" },
  processing: { color: "blue", next: "shipped", label: "Mark shipped" },
  shipped: { color: "purple", next: "delivered", label: "Confirm delivery" },
  delivered: { color: "green", next: null },
  cancelled: { color: "red", next: null },
};

const statusCounts = (orders) =>
  orderStatus.reduce(
    (acc, status) => ({ ...acc, [status]: orders.filter((o) => o.status === status).length }),
    {},
  );

function Admin() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (currentUser && !isAdmin) {
      navigate("/");
    }
  }, [currentUser, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/admin/users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/admin/all", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // orders are secondary; don't block the page
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const response = await fetch(`/api/users/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      setUsers(users.filter((u) => u._id !== id));
      toaster.create({ title: "User deleted.", type: "success", duration: 3000 });
    } else {
      toaster.create({ title: "Failed to delete user.", type: "error", duration: 3000 });
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleSave = async (id) => {
    setSaving(true);
    const response = await fetch(`/api/users/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editForm),
    });
    if (response.ok) {
      setUsers(users.map((u) => (u._id === id ? { ...u, ...editForm } : u)));
      setEditingUserId(null);
      toaster.create({ title: "User updated.", type: "success", duration: 3000 });
    } else {
      toaster.create({ title: "Failed to update user.", type: "error", duration: 3000 });
    }
    setSaving(false);
  };

  const applyStatus = async (order, status) => {
    const response = await fetch(`/api/orders/admin/${order._id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      toaster.create({ title: "Update failed", description: data.message, type: "error", duration: 4000 });
      return;
    }
    setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: data.order.status } : o)));
    toaster.create({
      title: `Order marked as "${data.order.status}".`,
      description: `Tracking: ${data.order.trackingNumber}`,
      type: "success",
      duration: 3000,
    });
  };

  if (!currentUser) return <Text p={8}>Loading…</Text>;
  if (!isAdmin) return null;
  if (loading) return <Text p={8}>Loading dashboard…</Text>;
  if (error) return <Text p={8} color="red.500">Error: {error}</Text>;

  const stats = statusCounts(orders);
  const clientCount = users.filter((u) => u.role === "client").length;
  const activeOrders = orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status));

  const statCards = [
    { label: "Clients", value: clientCount, icon: HiOutlineUsers, color: "indigo.500", bg: "indigo.50" },
    { label: "Pending orders", value: stats.pending, icon: HiOutlineShoppingBag, color: "orange.500", bg: "orange.50" },
    { label: "Processing", value: stats.processing, icon: HiOutlineCog6Tooth, color: "blue.500", bg: "blue.50" },
    { label: "Shipped", value: stats.shipped, icon: HiOutlineTruck, color: "purple.500", bg: "purple.50" },
  ];

  return (
    <Container maxW="container.lg" py={8} className="anim-fade-in-up">
      <VStack align="stretch" spacing={8}>
        <Heading as="h1" size="lg">
          <span className="gradient-text">Admin Dashboard</span>
        </Heading>

        {/* Site-wide event theme (admin only) */}
        <ThemeSwitcher />

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {statCards.map((card) => (
            <Box key={card.label} p={5} rounded="2xl" bg="white" _dark={{ bg: "gray.900", borderColor: "gray.800" }} border="1px solid" borderColor="gray.100">
              <Flex align="center" gap={3}>
                <Flex boxSize="40px" rounded="xl" align="center" justify="center" bg={card.bg} color={card.color}>
                  <card.icon size={20} />
                </Flex>
                <Box>
                  <Text fontSize="2xl" fontWeight="800" lineHeight="1">
                    {card.value}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {card.label}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        {/* Orders to confirm */}
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Order fulfillment{" "}
            <Badge colorScheme={activeOrders.length > 0 ? "orange" : "green"} rounded="full" px={2} ml={2}>
              {activeOrders.length} to act on
            </Badge>
          </Heading>

          {orders.length === 0 ? (
            <Text color="gray.500">No orders yet.</Text>
          ) : (
            <Box overflowX="auto">
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Tracking</Table.ColumnHeader>
                    <Table.ColumnHeader>Customer</Table.ColumnHeader>
                    <Table.ColumnHeader>Total</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {orders.map((order) => {
                    const meta = statusMeta[order.status] || { color: "gray", next: null };
                    const isDone = !meta.next;
                    return (
                      <Table.Row key={order._id}>
                        <Table.Cell>
                          <Text fontWeight="bold" color="indigo.500">{order.trackingNumber}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{order.shipping.name}</Text>
                          <Text fontSize="xs" color="gray.500">{order.shipping.city}</Text>
                        </Table.Cell>
                        <Table.Cell fontWeight="bold">${order.total}</Table.Cell>
                        <Table.Cell>
                          <Badge colorScheme={meta.color} rounded="full" px={2}>
                            {order.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack spacing={2}>
                            {!isDone && (
                              <Button size="xs" colorScheme="blue" onClick={() => applyStatus(order, meta.next)}>
                                {meta.label}
                              </Button>
                            )}
                            {order.status !== "cancelled" && order.status !== "delivered" && (
                              <Button size="xs" variant="outline" colorScheme="red" onClick={() => applyStatus(order, "cancelled")}>
                                Cancel
                              </Button>
                            )}
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </Box>

        {/* Users management */}
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Users{" "}
            <Badge colorScheme="indigo" rounded="full" px={2} ml={2}>
              {clientCount} clients
            </Badge>
          </Heading>

          <Box overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Email</Table.ColumnHeader>
                  <Table.ColumnHeader>Role</Table.ColumnHeader>
                  <Table.ColumnHeader>Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>
                      {editingUserId === user._id ? (
                        <Input size="sm" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      ) : (
                        user.name
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingUserId === user._id ? (
                        <Input size="sm" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                      ) : (
                        user.email
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingUserId === user._id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          style={{ padding: "4px 8px", borderRadius: 6 }}
                        >
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingUserId === user._id ? (
                        <HStack spacing={2}>
                          <Button size="sm" colorScheme="blue" onClick={() => handleSave(user._id)} loading={saving}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingUserId(null)}>
                            Cancel
                          </Button>
                        </HStack>
                      ) : (
                        <HStack spacing={2}>
                          <Button size="sm" onClick={() => handleEditClick(user)}>
                            Edit
                          </Button>
                          <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleDelete(user._id)}>
                            Delete
                          </Button>
                        </HStack>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}

export default Admin;