import '../../components/AccountsStyles/Profile.scss'
function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src="/avatar.png"
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-semibold">User Name</h2>
          <p className="text-gray-500">Client</p>
          <button className="text-indigo-600 text-sm mt-1">
            Change Photo
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Profile Info */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl mb-4">Profile Information</h3>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john@email.com</p>
          <p><strong>Phone:</strong> 12345678</p>
          <p><strong>DOB:</strong> 2000-01-01</p>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl mb-4">Security</h3>
          <button className="block mb-3">Change Password</button>
          <button className="block mb-3">Enable 2FA</button>
          <button className="block text-red-600">
            Deactivate Account
          </button>
        </div>

        {/* Purchase History */}
        <div className="bg-white p-6 rounded shadow md:col-span-2">
          <h3 className="text-xl mb-4">Purchase History</h3>
          <ul>
            <li>Order #1234 - $50</li>
            <li>Order #5678 - $120</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage
