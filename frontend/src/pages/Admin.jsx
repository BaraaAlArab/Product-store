import React, { useRef, useState, useEffect } from "react";

function Admin() {
  const usersRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const token = localStorage.getItem("token");
  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/admin/users", {
        method:"GET",
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

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const response = await fetch(`/api/users/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  // Edit user
  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditForm(user);
  };

  const handleSave = async (id) => {
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
    }
  };

  if (loading) return <h1>Loading…</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section ref={usersRef}>
        <h2>Users</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingUserId === user._id ? (
                    <input name="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  ) : (
                    user.name
                  )}
                </td>

                <td>
                  {editingUserId === user._id ? (
                    <input name="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                  ) : (
                    user.email
                  )}
                </td>

                <td>
                  {editingUserId === user._id ? (
                    <select name="role" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>

                <td>
                  {editingUserId === user._id ? (
                    <>
                      <button onClick={() => handleSave(user._id)}>Save</button>
                      <button onClick={() => setEditingUserId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(user)}>Edit</button>
                      <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Admin;
