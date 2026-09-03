import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/AccountsStyles/Profile.scss";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwMessage, setPwMessage] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/account");
      return;
    }
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMessage(null);
    setPwSubmitting(true);
    try {
      const res = await fetch("/api/users/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwMessage({ type: "error", text: data.message || "Something went wrong." });
        return;
      }
      setPwMessage({ type: "success", text: data.message || "Password changed." });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPwMessage({ type: "error", text: err.message });
    } finally {
      setPwSubmitting(false);
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-6">Loading…</div>;
  if (error)
    return (
      <div className="max-w-6xl mx-auto p-6 text-red-600">
        {error} —{" "}
        <button onClick={() => navigate("/account")} className="text-indigo-600">
          Sign in
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={user.avatar || "/avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl mb-4">Profile Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.telephone}</p>
          <p>
            <strong>DOB:</strong>{" "}
            {user.DOB ? new Date(user.DOB).toLocaleDateString() : "Not set"}
          </p>
          <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Security / Change password */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={pwSubmitting}
              className="bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
            >
              {pwSubmitting ? "Updating…" : "Change Password"}
            </button>
          </form>
          {pwMessage && (
            <p className={pwMessage.type === "error" ? "text-red-600 mt-3" : "text-green-600 mt-3"}>
              {pwMessage.text}
            </p>
          )}
        </div>

        {/* Purchase History */}
        <div className="bg-white p-6 rounded shadow md:col-span-2">
          <h3 className="text-xl mb-4">Purchase History</h3>
          <p className="text-gray-500">No orders yet.</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
