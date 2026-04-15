import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) formData.append('image', image);
    
    try {
      const { data } = await API.post('/posts', formData);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-container">
      <h2 className="title">Share Your Basketball Story</h2>
      {error && <p className="error-message" style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
      
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
        
        {/* Image Upload - Available to ALL users */}
        <div>
          <label>Upload Cover Image (Optional):</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
          />
          <small style={{ color: 'var(--muted)', display: 'block', marginTop: '0.25rem' }}>
            Max 5MB. Allowed: jpg, png, gif, webp
          </small>
        </div>
        
        {/* Image Preview */}
        {imagePreview && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p>Preview:</p>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '0.5rem' }}
            />
          </div>
        )}
        
        <div>
          <textarea
            placeholder="Write your basketball experience, tips, or story here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="12"
            required
          />
        </div>
        
        <button className="btn btn-color-1" type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </section>
  );
};

export default CreatePostPage;