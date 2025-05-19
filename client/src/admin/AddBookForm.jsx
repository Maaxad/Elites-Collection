import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBookForm = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');

  const genreOptions = ['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Fantasy'];

  const navigate = useNavigate();  // For handling navigation

  // Fetch the data from localStorage when the component is loaded
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('bookDetails'));
    const savedImage = localStorage.getItem('bookImage');  // Retrieve image from localStorage
    if (savedData) {
      setFormData(savedData);
    }
    if (savedImage) {
      setImage(savedImage);  // Set the image
      setPreviewUrl(savedImage);  // Set the preview URL for the image
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      };
      // Save updated form data to localStorage
      localStorage.setItem('bookDetails', JSON.stringify(newState));
      return newState;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Store the image in localStorage
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPreviewUrl(fileReader.result);
      // Store the image preview URL in localStorage
      localStorage.setItem('bookImage', fileReader.result);
    };
    if (file) {
      fileReader.readAsDataURL(file);
    }
  };

  const handleBookDetailsSubmit = (e) => {
    e.preventDefault();
    // Store the book details in localStorage
    localStorage.setItem('bookDetails', JSON.stringify(formData));
    // Navigate to the Add Page (make sure the route is correct)
    navigate('/admin/addpage');
  };

  return (
    <div className="add-book-form">
      <h2>Add a New Book</h2>
      {message && <p className="status-message">{message}</p>}
      <form onSubmit={handleBookDetailsSubmit} encType="multipart/form-data">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Author</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <label>Genre</label>
        <select name="genre" value={formData.genre} onChange={handleChange} required>
          <option value="">-- Select Genre --</option>
          {genreOptions.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />

        <label>Book Cover Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}

        <button type="submit">Next: Add Pages</button>
      </form>
    </div>
  );
};

export default AddBookForm;
