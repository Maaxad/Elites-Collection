import React, { useState } from 'react';
import './signin.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = form;
    try {
      const res = await axios.post('http://localhost:5000/signin', {
        email,
        password
      });

      toast.success(res.data.message || 'Successfully signed in');
      const { role, token } = res.data;  // Destructure the token from response

      // Save the role and token to localStorage (using 'authToken' for consistency)
      localStorage.setItem('role', role);
      localStorage.setItem('authToken', token);  // Save token under 'authToken'
      
      navigate(role === 'admin' ? '/admin-89xYz-Q4' : '/home'); // Redirect accordingly
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin">
        <form onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p>
            Forget password? <a href="/forget-password">Forget password</a>
          </p>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signin;
