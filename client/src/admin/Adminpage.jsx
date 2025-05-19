import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './adminpage.css';
import BanUsers from './BanUsers';
import AddBookForm from './AddBookForm';
import BookList from './BookList';
import Dashboard from './Dashboard';
import AdminNavbar from './AdminNavbar';
import AddPage from './AddPage';
import EditBookPages from './EditBookPages';

function Adminpage() {
  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="booklist" element={<BookList />} />
          <Route path="addbook" element={<AddBookForm />} />
          <Route path="Banuser" element={<BanUsers />} />
          <Route path="addpage" element={<AddPage />} />
          <Route path='edit-book/:bookId' element={<EditBookPages/>} />
        </Routes>
      </div>
    </div>
  );
}

export default Adminpage;
