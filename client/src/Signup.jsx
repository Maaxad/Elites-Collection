import { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false); // NEW: loading state

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true); // Disable button

    try {
      // Send role as 'customer' to the backend automatically
      await axios.post('http://localhost:5000/signup', {
        name, email, password, role: 'customer' // Always send role as 'customer'
      });
      toast.success('Signup successful! Check your email');
      navigate('/verify');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup">
        <form onSubmit={handleSubmit}>
          <h2>Signup</h2>
          <input
            name="name"
            type="text"
            placeholder="Enter your username"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          
          {/* Removed role selection */}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p>Already have an account? <a href="/signin">Login here</a></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
