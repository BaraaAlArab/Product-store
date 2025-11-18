import React, { useRef } from 'react';

function Admin() {
  // Create refs for each section
  const mainAdminRef = useRef(null);
  const salesRef = useRef(null);
  const usersRef = useRef(null);

  // Scroll handler
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Dashboard Navigation */}
      <div style={{
        marginTop: '2rem',
        marginBottom: '2rem',
        backgroundColor: '#e0e7ff',
        color: '#3730a3',
        width: 'fit-content',
        padding: '1rem 2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginLeft: '1rem'
      }}>
        <h1>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Dashboard</span>
          <small style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280' }}>Overview & management</small>
        </h1>

        {/* Clickable Sections */}
        <h2 style={{ cursor: 'pointer' }} onClick={() => scrollToSection(mainAdminRef)}>Main Admin Section</h2>
        <h2 style={{ cursor: 'pointer' }} onClick={() => scrollToSection(salesRef)}>Sales</h2>
        <h2 style={{ cursor: 'pointer' }} onClick={() => scrollToSection(usersRef)}>Users</h2>
      </div>

      {/* Sections */}
      <section ref={mainAdminRef} style={{ margin: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',  }}>
        <div style={{color: '#111827'}}>
            <h2>Main Admin Section</h2>
        <p>Change user profile, password, username, email, etc.</p>
       <table style={{borderCollapse: 'collapse', width: '100%', marginTop: '1rem', border: '1px solid #e5e7eb'}}>
  <thead style={{backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb', border: '1px solid #e5e7eb'}}>
    <tr style={{backgroundColor: '#f3f4f6', border: '2px solid #e5e7eb'}}>
      <th style={{backgroundColor: '#f3f4f6', border: '2px solid #e5e7eb'}} >Feature</th>
      <th className="text-left py-3 px-6 font-semibold uppercase text-sm">Description</th>
    </tr>
  </thead>
  <tbody border="1" style={{border: '1px solid #e5e7eb'}}>
    <tr style={{backgroundColor:"gray",border :'2px solid gray' }} className="bg-white hover:bg-indigo-50 transition-colors">
      <td   style={{backgroundColor:"gray",border :'2px solid gray', padding:"3px", fontSize:"14px" }} className="py-3 px-6 font-medium">
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold">Profile</span>
        Profile Management
      </td>
      <td className="py-3 px-6 text-gray-700">Update user profile information including name, email, and contact details.</td>
    </tr>
    <tr className="bg-gray-50 hover:bg-indigo-50 transition-colors">
      <td className="py-3 px-6 font-medium">
        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">Security</span>
        Password Change
      </td>
      <td className="py-3 px-6 text-gray-700">Securely change your account password with validation checks.</td>
    </tr>
    <tr className="bg-white hover:bg-indigo-50 transition-colors">
      <td className="py-3 px-6 font-medium">
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">Account</span>
        Username Update
      </td>
      <td className="py-3 px-6 text-gray-700">Modify your username while ensuring uniqueness across the platform.</td>
    </tr>
    <tr className="bg-gray-50 hover:bg-indigo-50 transition-colors">
      <td className="py-3 px-6 font-medium">
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">Contact</span>
        Email Update
      </td>
      <td className="py-3 px-6 text-gray-700">Change your registered email address with verification steps.</td>
    </tr>
  </tbody>
</table>

 </div>
        
      </section>

      <section ref={salesRef} style={{ margin: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
       <div style={{color: '#111827'}}><h2>Sales Section</h2>
        <p>Manage sales data, view analytics, and reports.</p></div>
        
      </section>

      <section ref={usersRef} style={{ margin: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
       <div style={{color: '#111827'}}><h2>Users Section</h2>
        <p>Manage users, add new users, or remove existing ones.</p></div>
        
      </section>
    </div>
  );
}

export default Admin;
