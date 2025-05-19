import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './adminpage.css';
import Modal from './Modal'; // Import your modal component
import { toast } from 'react-toastify';

function Books() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch books on load
  useEffect(() => {
    axios
      .get('http://localhost:5000/search-books')
      .then((res) => {
        setBooks(res.data);
        setFilteredBooks(res.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        toast.error('Failed to fetch books');
      });
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = books.filter((book) => {
      const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGenre && matchesSearch;
    });
    setFilteredBooks(filtered);
  }, [searchTerm, selectedGenre, books]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (bookId) => {
    setBookToDelete(bookId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    const token = localStorage.getItem('token');
    console.log('Deleting with token:', token); // Debug log

    if (!token) {
      toast.error('You are not logged in or your session has expired.');
      setTimeout(() => window.location.href = '/signin', 2000);
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/books/${bookToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks((prev) => prev.filter((book) => book._id !== bookToDelete));
      setFilteredBooks((prev) => prev.filter((book) => book._id !== bookToDelete));
      setShowModal(false);
      toast.success('Book successfully deleted');
    } catch (error) {
      const message = error.response?.data?.message;

      console.error('Error deleting book:', message || error.message);

      if (message === 'Invalid or expired token') {
        toast.error('Session expired. Please log in again.');
        localStorage.clear();
        setTimeout(() => window.location.href = '/signin', 2000);
      } else {
        toast.error('Failed to delete book.');
      }
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  return (
    <div className="booklist-page">
      <nav>
        <h2>BOOK COL<span className="booklist-header-highlight">LECTIONS</span></h2>
        <div className="booklist-genre-dropdown">
          <button className="booklist-dropdown-button" onClick={toggleDropdown}>
            Book Types
          </button>
          {isDropdownOpen && (
            <ul className="booklist-dropdown-menu">
              {['Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Romance', 'Thriller', 'Science Fiction'].map((genre) => (
                <li key={genre} onClick={() => handleGenreSelect(genre)}>
                  {genre}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      <section className="booklist-search-section">
        <h3>Looking for something specific? Start typing below.</h3>
        <div className="booklist-search-input-container">
          <input
            type="text"
            placeholder="Search"
            className="booklist-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </section>

      <section className="booklist-books-results">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book._id} className="booklist-book-card">
              <img src={`http://localhost:5000/uploads/${book.image}`} alt={book.title} className="booklist-book-image" />
              <div className="booklist-book-details">
                <h4>{book.title}</h4>
                <p className="booklist-book-description">{book.description}</p>
                <p><strong>Author: {book.author}</strong></p>
                <div className="booklist-genre-footer">
                <em>{book.genre}</em>
                </div>
                <button
                  className="delete-book-button"
                  onClick={() => handleDelete(book._id)}
                > 
                  X
                </button>
                <button
                className="edit-book-button"
                onClick={() => navigate(`/admin-89xYz-Q4/edit-book/${book._id}`)}
                >
                Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No books found matching your filter.</p>
        )}
      </section>

      {showModal && (
        <Modal
          message="Are you sure you want to delete this book?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default Books;
