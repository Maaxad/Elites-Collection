import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './Landingpage';
import Signin from './Signin';
import Signup from './Signup';
import Forget from './Forget';
import Home from './Home';
import Books from './Books';
import Adminpage from './admin/Adminpage';
import MyLibrary from './MyLibrary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './Verify';
import ViewBook from './ViewBook';
import AddPage from './admin/AddPage';
import RequireAdmin from './admin/RequireAdmin';
import AdminSignin from './admin/AdminSignin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<Forget />} />
        <Route path="/home" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/mylibrary" element={<MyLibrary />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/books/:id" element={<ViewBook />} />
        <Route path="/add-page" element={<AddPage />} />

        <Route path="/admin-89xYz-Q4/signin" element={<AdminSignin />} />

        <Route
          path="/admin-89xYz-Q4/*"
          element={
            <RequireAdmin>
              <Adminpage />
            </RequireAdmin>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
