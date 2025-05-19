import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './books.css';

function Books() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch books
  useEffect(() => {
    axios.get('http://localhost:5000/search-books')
      .then((res) => {
        setBooks(res.data);
        setFilteredBooks(res.data);
      })
      .catch((error) => {
        console.error('Error fetching books', error);
      });
  }, []);

  // Filter logic
  useEffect(() => {
    const filtered = books.filter(book => {
      const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGenre && matchesSearch;
    });
    setFilteredBooks(filtered);
  }, [searchTerm, selectedGenre, books]);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleGenreSelect = (genre) => {
    setSelectGenre(genre);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='section-bookspages'>
      {/* Nav */}
      <nav className='section-nav'>
        <h2>BOOK COL<span className='section-header-books'>LECTIONS</span></h2>
        <div className="section-menu-books">
          <button className="section-dropdown-btn" onClick={toggleDropdown}>
            Book Types
          </button>

          {isDropdownOpen && (
            <ul className='section-dropdown-menu'>
              {['Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Romance', 'Thriller', 'Science Fiction'].map((genre) => (
                <li key={genre} onClick={() => handleGenreSelect(genre)}>
                  {genre}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Search */}
      <section>
        <div className="section-search-books">
          <h2>Welcome to our book collection, where stories come alive and every reader finds their next favorite adventure. </h2>
          <h3>Looking for something specific? Start typing below.</h3>
          <div className="section-search">
            <input
              type="text"
              placeholder='Search by books...'
              className='section-search-input'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </section>

      {/* Books */}
      <section className='section-books-grid'>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book._id} className='section-book-card'>
              <img
                src={`http://localhost:5000/uploads/${book.image}`}
                alt={book.title}
                className='section-book-image'
              />
              <div className='section-book-details'>
                <h3>{book.title}</h3>
                <h4><strong>Author: {book.author}</strong></h4>
                <h5 className='section-book-description'>{book.description}</h5>
                <p className='section-book-genre'><em>Genre: {book.genre}</em></p>

                {/* Link to View Book */}
                <Link to={`/books/${book._id}`} className="view-book-link">
                  View Book
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No book found matching your filter</p>
        )}
      </section>
    </div>
  );
}

export default Books;
