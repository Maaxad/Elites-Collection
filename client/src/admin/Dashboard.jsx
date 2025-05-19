import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminpage.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalAdmins: 0
  });

  useEffect(() => {
    axios.get('http://localhost:5000/admin/stats')
      .then(res => {
        setStats(res.data);
      })
      .catch(err => {
        console.error('Failed to load dashboard stats', err);
      });
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Welcome to the Admin Dashboard!</h1>
      <h2>Manage and monitor your platform's stats and activities</h2>
      <p>
        Here you can review the total number of books, users, and admins. Make informed decisions to improve your platform.
      </p>
      
      <h3>Overview</h3>
      <p>
        The platform has seen significant growth this month. Keep up the good work!
      </p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Books</h3>
          <p>{stats.totalBooks}</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Admins</h3>
          <p>{stats.totalAdmins}</p>
        </div>
      </div>

      <h2>Additional Information</h2>
      <p>
        As we continue to grow, your contributions are vital in maintaining a safe and user-friendly platform. Stay updated on all activities.
      </p>
      
      <h3>Dashboard Tips</h3>
      <p>Check the analytics section for more insights into user behavior and trends!</p>

      <h4>Future Updates</h4>
      <p>Stay tuned for new features that will improve the platform even more. Exciting changes are coming soon!</p>
    </div>
  );
}

export default Dashboard;
