import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ContactPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myMessages, setMyMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeTab, setActiveTab] = useState('send');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMyMessages();
      fetchUnreadCount();
    }
  }, [user]);

  const fetchMyMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data } = await API.get('/messages/my-messages');
      setMyMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get('/messages/my-messages/unread/count');
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await API.put(`/messages/my-messages/${messageId}/read`);
      setMyMessages(myMessages.map(msg => 
        msg._id === messageId ? { ...msg, status: 'read' } : msg
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await API.post('/messages/contact', {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
        
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        
        if (user) {
          fetchMyMessages();
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      unread: { background: '#dc2626', color: 'white' },
      read: { background: '#6b7280', color: 'white' },
      replied: { background: '#10b981', color: 'white' }
    };
    return (
      <span style={{ 
        background: styles[status]?.background || '#6b7280',
        color: 'white',
        padding: '0.2rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.7rem'
      }}>
        {status}
      </span>
    );
  };

  return (
    <section>
      <h1 className="title">Contact & Support</h1>

      {/* Tabs for logged in users */}
      {user && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('send')}
            style={{
              background: activeTab === 'send' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'send' ? '#fff' : 'var(--text-color)',
              border: `1px solid ${activeTab === 'send' ? 'var(--accent)' : 'var(--border)'}`,
              padding: '0.75rem 1.5rem',
              borderRadius: '2rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
            Send New Message
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            style={{
              background: activeTab === 'inbox' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'inbox' ? '#fff' : 'var(--text-color)',
              border: `1px solid ${activeTab === 'inbox' ? 'var(--accent)' : 'var(--border)'}`,
              padding: '0.75rem 1.5rem',
              borderRadius: '2rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              position: 'relative'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            My Inbox
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#dc2626',
                borderRadius: '50%',
                padding: '0.1rem 0.4rem',
                fontSize: '0.7rem',
                color: 'white'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Send Message Form */}
      {(activeTab === 'send' || !user) && (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={loading}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid var(--accent)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)'
                }}
              >
                <option>📝 General Inquiry</option>
                <option>🔧 Technical Support</option>
                <option>🏀 Basketball Related</option>
                <option>🤝 Partnership/Collaboration</option>
                <option>⚠️ Report an Issue</option>
                <option>📌 Other</option>
              </select>
            </div>
            <div>
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
            <button className="btn btn-color-1" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {submitted && (
            <div style={{ color: 'var(--accent)', textAlign: 'center', marginTop: '1rem' }}>
              ✓ Message sent successfully!
            </div>
          )}
        </>
      )}

      {/* User Inbox */}
      {activeTab === 'inbox' && user && (
        <div>
          <h2 className="title" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            My Messages
          </h2>
          {loadingMessages ? (
            <p style={{ textAlign: 'center' }}>Loading messages...</p>
          ) : myMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--card-bg)', borderRadius: '1rem' }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" style={{ margin: '0 auto 1rem', display: 'block' }}>
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <p>No messages yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>When you send messages, admin replies will appear here.</p>
            </div>
          ) : (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {myMessages.map(message => (
                <div 
                  key={message._id} 
                  style={{ 
                    background: 'var(--card-bg)', 
                    padding: '1rem', 
                    borderRadius: '0.5rem', 
                    marginBottom: '1rem',
                    border: message.status === 'unread' ? '2px solid var(--accent)' : '1px solid var(--border)',
                    cursor: message.status === 'unread' ? 'pointer' : 'default'
                  }}
                  onClick={() => message.status === 'unread' && markAsRead(message._id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <div>
                      <strong>{message.name}</strong>
                      <small style={{ marginLeft: '0.5rem', color: 'var(--muted)' }}>{message.subject}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {getStatusBadge(message.status)}
                      <small style={{ color: 'var(--muted)' }}>{new Date(message.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                  
                  <div style={{ 
                    background: 'rgba(0,0,0,0.05)', 
                    padding: '0.75rem', 
                    borderRadius: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '0.15rem' }}>
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                      <strong>You wrote:</strong> {message.message}
                    </p>
                  </div>
                  
                  {message.reply && message.reply.message && (
                    <div style={{ 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      padding: '0.75rem', 
                      borderRadius: '0.5rem',
                      borderLeft: '3px solid #10b981'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ marginTop: '0.15rem' }}>
                          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15z"/>
                        </svg>
                        <strong>Admin Reply:</strong> {message.reply.message}
                      </p>
                      <small style={{ color: 'var(--muted)' }}>
                        Replied on {new Date(message.reply.repliedAt).toLocaleString()}
                      </small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map & Location Section */}
      <h2 className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Our Location
      </h2>
      <div className="section-container">
        <div className="details-container" style={{ flex: 2 }}>
          <h3>Basketball Court Address</h3>
          <p>
            <strong>Beyond The ARC Headquarters</strong><br />
            Basketball City Complex<br />
            Barangay Mayagay, San Fernando City<br />
            La Union, Philippines 2500
          </p>
          <div style={{ marginTop: '1rem' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 6L12 13L2 6M22 6v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6l10 7 10-7z"/>
              </svg>
              <strong>Email:</strong> hello@beyondthearc.com
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <strong>Phone:</strong> +63 (72) 123 4567
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <strong>Office Hours:</strong> Mon-Sat, 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto 2rem auto', 
        borderRadius: '1rem', 
        overflow: 'hidden',
        border: '2px solid var(--accent)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <iframe 
          title="Beyond The ARC Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123387.567891234!2d120.3567!3d16.6158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a8b8b8b8b8b%3A0x0!2sSan%20Fernando%20City%2C%20La%20Union!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
          width="100%" 
          height="400" 
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Can't see the map? Visit us at Basketball City Complex, San Fernando City, La Union
        </p>
      </div>

      {/* Contact Info Cards */}
      <h2 className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        Get in Touch
      </h2>
      <div className="section-container">
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M22 6L12 13L2 6M22 6v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6l10 7 10-7z"/>
          </svg>
          <h3>Email Us</h3>
          <p>hello@beyondthearc.com</p>
          <p>support@beyondthearc.com</p>
          <small>Response within 24-48 hours</small>
        </div>
        
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <h3>Call Us</h3>
          <p>+63 (72) 123 4567</p>
          <p>+63 (912) 345 6789</p>
          <small>Monday - Saturday, 9AM - 6PM</small>
        </div>
        
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <h3>Visit Us</h3>
          <p>Basketball City Complex</p>
          <p>San Fernando City, La Union</p>
          <p>Philippines 2500</p>
        </div>
      </div>

      {/* Social Media Section */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4z"/>
            <path d="M8 12h8M12 8v8"/>
          </svg>
          Follow Us
        </h3>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
             style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
             onMouseEnter={(e) => e.currentTarget.style.color = '#1877f2'}
             onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
            </svg>
          </a>
          
          {/* Twitter/X */}
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
             style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
             onMouseEnter={(e) => e.currentTarget.style.color = '#1da1f2'}
             onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/>
            </svg>
          </a>
          
          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
             style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
             onMouseEnter={(e) => e.currentTarget.style.color = '#e4405f'}
             onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
              <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
            </svg>
          </a>
          
          {/* YouTube */}
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
             style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
             onMouseEnter={(e) => e.currentTarget.style.color = '#ff0000'}
             onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.582 6.186c-.23-.86-.908-1.538-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418c-.86.23-1.538.908-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.86.908 1.538 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418c.86-.23 1.538-.908 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.5v-7l6 3.5-6 3.5z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;