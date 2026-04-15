import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setTitle(data.title);
      setBody(data.body);
      setCurrentImage(data.image || '');
    } catch (err) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) formData.append('image', image);
    
    try {
      await API.put(`/posts/${id}`, formData);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '4rem' }}>Loading post...</p>;

  return (
    <section className="form-container">
      <h2 className="title">Edit Your Post</h2>
      {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}
      
      {currentImage && (
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <p>Current image:</p>
          <img 
            src={`http://localhost:5000/uploads/${currentImage}`}
            alt="Current"
            style={{ maxWidth: '200px', borderRadius: '0.5rem' }}
          />
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Write your post content here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="12"
            required
          />
        </div>
        
        {user?.role === 'admin' && (
          <div>
            <label>Replace Image (Admin only):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        )}
        
        <button className="btn btn-color-1" type="submit">Update Post</button>
      </form>
    </section>
  );
};

export default EditPostPage;