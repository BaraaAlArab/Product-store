import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Select,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster.jsx";

function Admin() {
  const [users, setUsers] = useState([]);
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
      return;
    }
  }, [currentUser, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const response = await fetch(`/api/users/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      setUsers(users.filter((u) => u._id !== id));
      toaster.create({ title: "User deleted.", status: "success", duration: 3000 });
    } else {
      toaster.create({ title: "Failed to delete user.", status: "error", duration: 3000 });
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });
    if (response.ok) {
      setUsers(users.map((u) => (u._id === id ? { ...u, ...editForm } : u)));
      setEditingUserId(null);
      toaster.create({ title: "User updated.", status: "success", duration: 3000 });
    } else {
      toaster.create({ title: "Failed to update user.", status: "error", duration: 3000 });
    }
    setSaving(false);
  };

  if (!currentUser) return <Text p={8}>Loading…</Text>;
  if (!isAdmin) return null;
  if (loading) return <Text p={8}>Loading users…</Text>;
  if (error) return <Text p={8} color="red.500">Error: {error}</Text>;

  return (
    <Container maxW="container.lg" py={8}>
      <VStack align="stretch" spacing={6}>
        <Heading as="h1" size="lg">Admin Dashboard</Heading>

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
                      <Input
                        size="sm"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      user.name
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {editingUserId === user._id ? (
                      <Input
                        size="sm"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
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
      </VStack>
    </Container>
  );
}

export default Admin;
