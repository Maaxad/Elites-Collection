import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './verify.css';
import { useNavigate } from 'react-router-dom';

function Verify() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading before request

    try {
      const res = await axios.post('http://localhost:5000/verify', {
        email,
        code,
      });

      toast.success(res.data.message || 'Email verified!');
      navigate('/signin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false); // Reset loading after response
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify">
        <form onSubmit={handleSubmit}>
          <h2>Email Verification</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verify;
