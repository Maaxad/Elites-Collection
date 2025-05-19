import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './viewbook.css';

function ViewBook() {
  const { id } = useParams();  // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch book details
  useEffect(() => {
    axios.get(`http://localhost:5000/books/${id}`)
      .then((response) => {
        setBook(response.data);
        if (response.data.pages && response.data.pages.length > 0) {
          setTotalPages(response.data.pages.length);
        } else {
          setTotalPages(0);
        }
      })
      .catch((error) => {
        toast.error(`Error fetching book details: ${error.response ? error.response.data.message : error.message}`);
      });
  }, [id]);

  // Ensure book is added to user's library in backend
  const ensureBookInLibrary = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`http://localhost:5000/user/library`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book._id,
          status: 'reading',
        }),
      });
    } catch (error) {
      console.error('Error ensuring book is in library:', error);
    }
  };

  // Sync progress with backend
  const syncProgressWithBackend = async (status = 'reading', progress = 0) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`http://localhost:5000/user/library/${book._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, progress }),
      });
    } catch (error) {
      console.error('Error syncing progress with backend:', error);
    }
  };

  // Update progress in localStorage + backend
  const updateReadingProgress = (bookData, page) => {
    const currentBooks = JSON.parse(localStorage.getItem('currentlyReading')) || [];
    const progress = Math.floor((page / totalPages) * 100);

    const updatedBooks = currentBooks.map(b => {
      if (b._id === bookData._id) {
        return { ...b, progress };
      }
      return b;
    });

    const isAlreadyAdded = currentBooks.some(b => b._id === bookData._id);
    if (!isAlreadyAdded) {
      updatedBooks.push({
        _id: bookData._id,
        title: bookData.title,
        author: bookData.author,
        progress,
      });
    }

    localStorage.setItem('currentlyReading', JSON.stringify(updatedBooks));
    syncProgressWithBackend('reading', progress);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updateReadingProgress(book, nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      updateReadingProgress(book, prevPage);
    }
  };

  const markAsFinished = () => {
    const currentBooks = JSON.parse(localStorage.getItem('currentlyReading')) || [];
    const updatedBooks = currentBooks.filter(b => b._id !== book._id);
    localStorage.setItem('currentlyReading', JSON.stringify(updatedBooks));

    const finishedBooks = JSON.parse(localStorage.getItem('finishedBooks')) || [];
    const isAlreadyFinished = finishedBooks.some(b => b._id === book._id);

    if (!isAlreadyFinished) {
      finishedBooks.push({ ...book, progress: 100 });
      localStorage.setItem('finishedBooks', JSON.stringify(finishedBooks));
      toast.success('Book marked as finished!');
      syncProgressWithBackend('finished', 100);
    } else {
      toast.info('This book has already been marked as finished.');
    }
  };

  // Ensure book exists in backend + sync progress
  useEffect(() => {
    if (book) {
      ensureBookInLibrary();
    }
  }, [book]);

  // Sync on book/page change
  useEffect(() => {
    if (book && totalPages > 0) {
      updateReadingProgress(book, currentPage);
    }
  }, [book, currentPage, totalPages]);

  if (!book) return <p>Loading...</p>;

  return (
    <div className="view-book-container">
      <h2>{book.title}</h2>
      <h3>{book.author}</h3>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Description:</strong> {book.description}</p>

      <div className="book-pages">
        <p><strong>Page {currentPage} of {totalPages}</strong></p>
        <div className="page-content">
          {
            Array.isArray(book.pages) && totalPages > 0 ? (
              <p>{book.pages[currentPage - 1]}</p>
            ) : (
              <p>🙋‍♂️ No pages available.</p>
            )
          }
        </div>
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>

      {currentPage === totalPages && (
        <button className="mark-finished-btn" onClick={markAsFinished}>
          Mark as Finished
        </button>
      )}
    </div>
  );
}

export default ViewBook;
