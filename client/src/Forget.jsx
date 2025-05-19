import { useState } from 'react';
import './forget.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Forget() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    code: ''
  });
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/send-reset-code', {
        email: form.email
      });
      toast.success(res.data.message || 'Please check your email');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending reset code');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, code } = form;
  
    console.log('Submitting reset form:', { email, password, confirmPassword, code }); // <-- DEBUG LOG
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
  
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:5000/reset-password', {
        email,
        password,
        code
      });
      toast.success(res.data.message || 'Password reset successfully');
      navigate('/signin');
    } catch (error) {
      console.error('Reset error:', error.response?.data || error.message); // <-- DEBUG LOG
      toast.error(error.response?.data?.message || 'Error resetting password');
    }
  };
  

  return (
    <div className="forget-wrapper">
    <div className="forget">
      <h2>Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
          <button type="submit">Send Code</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleResetSubmit}>
          <input type="text" name="code" onChange={handleChange} placeholder="Enter the code" required />
          <input
            type="password"
            name="password"
            placeholder="New password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            onChange={handleChange}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
    </div>
  );
}

export default Forget;
