import React from 'react';
import { NavLink } from 'react-router-dom';
import './adminpage.css';

function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <h2 className="admin-navbar-title">Admin Panel</h2>
      <div className="admin-nav-links">
        <NavLink to="/admin-89xYz-Q4/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/admin-89xYz-Q4/booklist" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Book List
        </NavLink>
        <NavLink to="/admin-89xYz-Q4/addbook" className={({ isActive }) => isActive ? 'active-link' : ''}>
          Add Book
        </NavLink>
        <NavLink to="/admin-89xYz-Q4/banuser" className={({ isActive }) => isActive ? 'active-link' : ''}>
        Ban User
        </NavLink>
      </div>
    </nav>
  );
}

export default AdminNavbar;
