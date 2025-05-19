import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddPage = () => {
  const [formData, setFormData] = useState({
    pages: [], // Array to hold pages
  });

  const navigate = useNavigate(); // Initialize the navigate function

  // Function to add a new page (empty content)
  const handleAddPage = () => {
    setFormData((prevState) => ({
      ...prevState,
      pages: [...prevState.pages, ''], // Add a blank page to the pages array
    }));
  };

  // Function to handle changes to page content
  const handlePageContentChange = (index, content) => {
    const updatedPages = [...formData.pages];
    updatedPages[index] = content; // Update content for the specific page
    setFormData((prevState) => ({
      ...prevState,
      pages: updatedPages,
    }));
  };

  // Convert base64 image (from localStorage) back to Blob
  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // Submit the data (book details and pages)
  const handleSubmit = () => {
    const bookDetails = JSON.parse(localStorage.getItem('bookDetails')); // Retrieve book details
    const imageData = localStorage.getItem('bookImage'); // Retrieve base64 image
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      toast.error('Unauthorized: No token found. Please sign in.');
      return;
    }

    const data = new FormData();

    // Append book details to FormData
    for (const key in bookDetails) {
      data.append(key, bookDetails[key]);
    }

    // Append pages to FormData
    data.append('pages', JSON.stringify(formData.pages));

    // Convert and append the image (if available)
    if (imageData) {
      const blob = base64ToBlob(imageData);
      data.append('image', blob, 'book-cover.jpg'); // Name is optional
    }

    // Send the request to the server
    axios
      .post('http://localhost:5000/add-books', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include token in header
        },
      })
      .then((res) => {
        toast.success('Book added successfully!');
        // Clear localStorage after submission
        localStorage.removeItem('bookDetails');
        localStorage.removeItem('bookImage');
        navigate('/admin/booklist'); // Navigate to book list
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error adding book.');
      });
  };

  return (
    <div className="add-page-form">
      <h2>Add Pages to the Book</h2>

      {/* Display the added pages */}
      <div className="added-pages">
        {formData.pages.map((page, index) => (
          <div key={index} className="page-container">
            <textarea
              value={page}
              onChange={(e) => handlePageContentChange(index, e.target.value)}
              placeholder={`Enter content for page ${index + 1}...`}
              rows="10"
            />
          </div>
        ))}
      </div>

      {/* Add page button */}
      <button type="button" className="add-page-button" onClick={handleAddPage}>
        Add Page
      </button>

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button type="button" onClick={() => navigate('/admin/addbook')}>
          Back to Add Book
        </button>

        <button type="button" onClick={handleSubmit}>
          Done
        </button>
      </div>
    </div>
  );
};

export default AddPage;
