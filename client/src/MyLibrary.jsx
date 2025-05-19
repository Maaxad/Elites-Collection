import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './mylibrary.css';

function MyLibrary() {
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [finished, setFinished] = useState([]);
  const [error, setError] = useState(null);
  const { bookId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Check if the token is available and valid
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin'); // Redirect to signin if no token
    }
  }, [navigate]);

  // Fetch the user's library when the component loads
  useEffect(() => {
    if (!token) return;  // Don't make the request if there's no token

    fetch('http://localhost:5000/user/library', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          navigate('/signin'); // Redirect to signin if unauthorized
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch library data');
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setCurrentlyReading(data.filter(book => book.status === 'reading'));
        setFinished(data.filter(book => book.status === 'finished'));
      })
      .catch(err => {
        console.error('Error fetching library:', err);
        setError('Unable to load your library. Please try again later.');
      });
  }, [token, navigate]);

  // Mark the clicked book as "Finished"
  const markAsFinished = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:5000/user/library/${bookId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'finished' }),
      });

      const updatedBook = await res.json();

      // After the status update, update the UI
      setCurrentlyReading((prev) =>
        prev.filter((book) => book.userBookId !== bookId)
      );
      setFinished((prev) => [...prev, updatedBook]); // Add the updated book to the finished list
    } catch (err) {
      console.error('Failed to mark book as finished:', err);
      setError('Unable to mark book as finished. Please try again later.');
    }
  };

  // Remove a book from the library
  const removeBook = async (userBookId, section) => {
    try {
      await fetch(`http://localhost:5000/user/library/${userBookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (section === 'reading') {
        setCurrentlyReading(prev => prev.filter(book => book.userBookId !== userBookId));
      } else {
        setFinished(prev => prev.filter(book => book.userBookId !== userBookId));
      }
    } catch (err) {
      console.error('Failed to remove book:', err);
      setError('Unable to remove book. Please try again later.');
    }
  };

  // Render each section of the library (Currently Reading / Finished)
  const renderSection = (title, books, sectionKey) => (
    <div className="library-section">
      <h3>{title}</h3>
      {books.length > 0 ? (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.userBookId} className="book-item">
              <div className="book-details">
                <h4>{book.title}</h4>
                <p>By {book.author}</p>
                {book.progress != null && <p>Progress: {book.progress}%</p>}
              </div>
              <button onClick={() => markAsFinished(book.userBookId)} className="mark-finished-btn">
                Mark as Finished
              </button>
              <button onClick={() => removeBook(book.userBookId, sectionKey)} className="remove-btn">
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-message">No books in this section.</p>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="error-message">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="library-page">
      <h2>My Library</h2>
      {renderSection('📖 Currently Reading', currentlyReading, 'reading')}
      {renderSection('✅ Finished Books', finished, 'finished')}
    </div>
  );
}

export default MyLibrary;
