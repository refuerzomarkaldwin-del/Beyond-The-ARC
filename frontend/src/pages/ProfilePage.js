import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle profile update with image
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio || '');
    
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }
    
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setProfilePic(null); // Clear the file input
      
      // Reset file input
      const fileInput = document.getElementById('profilePicInput');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  // Get profile picture URL
  const profilePicUrl = user?.profilePic 
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : 'https://ui-avatars.com/api/?background=ff9933&color=fff&name=' + encodeURIComponent(user?.name || 'User');

  return (
    <section className="form-container">
      <h2 className="title">My Profile</h2>
      
      {/* Profile Picture Preview */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img 
          src={profilePicUrl} 
          alt="Profile" 
          style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            objectFit: 'cover',
            border: '3px solid var(--accent)'
          }}
        />
      </div>
      
      {/* Messages */}
      {message && <p style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
      
      {/* Profile Update Form */}
      <form onSubmit={handleProfileUpdate}>
        <h3>Edit Profile</h3>
        <div>
          <input
            type="text"
            placeholder="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Short bio about your basketball journey..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
          />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input
            id="profilePicInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
          <small style={{ color: 'var(--muted)' }}>Max 5MB. Allowed: jpg, png, gif, webp</small>
        </div>
        <button className="btn btn-color-1" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      
      {/* Password Change Form */}
      <form onSubmit={handlePasswordChange} style={{ marginTop: '2rem' }}>
        <h3>Change Password</h3>
        <div>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="New Password (min 6 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        <button className="btn btn-color-2" type="submit" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </section>
  );
};

export default ProfilePage;