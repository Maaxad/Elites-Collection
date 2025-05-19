import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminpage.css';
import { toast } from 'react-toastify';

function BanUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in again.');
      return;
    }

    axios.get('http://localhost:5000/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => {
        setUsers(res.data);
        // Check if the current user is an admin
        const currentUser = res.data.find(user => user._id === localStorage.getItem('userId'));
        if (currentUser && currentUser.role === 'admin') {
          setIsAdmin(true);
        }
      })
      .catch(err => {
        console.error('Error fetching users', err);
        toast.error('Failed to fetch users');
      });
  }, []);

  // Handle toggling admin role
  const handleRoleToggle = async (userId, currentRole) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in again.');
      return;
    }

    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await axios.post(
        `http://localhost:5000/admin/toggle-role/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`User role updated to ${newRole}`);
      setUsers(prev => prev.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  // Handle banning a user
  const handleBan = async (userId) => {
    const confirmBan = window.confirm('Are you sure you want to ban this user?');
    if (!confirmBan) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in again.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/admin/ban/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('User has been banned.');
      setUsers(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ban-users-page">
      {isAdmin && (
        <div className="admin-banner">
          <h2>Admin Section</h2>
          <p>Welcome, Admin! You can manage users and toggle roles.</p>
        </div>
      )}

      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredUsers.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {isAdmin && (
                    <button
                      className="toggle-role-button"
                      onClick={() => handleRoleToggle(user._id, user.role)}
                    >
                      bigu
                    </button>
                  )}
                  <button
                    className="ban-user-button"
                    onClick={() => handleBan(user._id)}
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default BanUsers;
