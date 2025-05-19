import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminpage.css'; // Create this CSS file if needed
import { toast } from 'react-toastify';
import axios from 'axios';

function AdminSignin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/signin', {
        email: form.email,
        password: form.password
      });

      if (res.data.role !== 'admin') {
        toast.error('You are not authorized as admin');
        return;
      }

      localStorage.setItem('token', res.data.token);
      toast.success('Welcome, admin!');
      navigate('/admin-89xYz-Q4/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signin-wrapper">
      <form className="admin-signin-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Admin email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}

export default AdminSignin;
