import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditBookPages = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing book pages
  useEffect(() => {
    axios.get(`http://localhost:5000/books/${bookId}`)
      .then(res => {
        setPages(res.data.pages || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load book data");
        setLoading(false);
      });
  }, [bookId]);

  const handlePageChange = (index, content) => {
    const updated = [...pages];
    updated[index] = content;
    setPages(updated);
  };

  const addPage = () => {
    setPages([...pages, '']);
  };

  const saveChanges = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`http://localhost:5000/books/${bookId}`, {
        pages
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Book pages updated");
      navigate('/admin-89xYz-Q4/booklist');
    } catch (err) {
      console.error(err);
      toast.error("Failed to update book");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-pages-form">
      <h2>Edit Pages</h2>
      {pages.map((page, index) => (
        <textarea
          key={index}
          rows={10}
          value={page}
          onChange={(e) => handlePageChange(index, e.target.value)}
        />
      ))}
      <button onClick={addPage}>Add Page</button>
      <button onClick={saveChanges}>Save</button>
    </div>
  );
};

export default EditBookPages;
