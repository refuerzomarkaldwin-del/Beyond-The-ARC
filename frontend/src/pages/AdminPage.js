import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageStats, setMessageStats] = useState({ unread: 0, read: 0, replied: 0, total: 0 });
  const [tab, setTab] = useState('users');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fetchMessages();
    fetchMessageStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/admin/posts');
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await API.get('/messages/admin/messages');
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const fetchMessageStats = async () => {
    try {
      const { data } = await API.get('/messages/admin/messages/stats/summary');
      setMessageStats(data);
    } catch (error) {
      console.error('Error fetching message stats:', error);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/status`);
      setUsers(users.map(u => u._id === userId ? data.user : u));
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const removePost = async (postId) => {
    if (!window.confirm('Remove this post?')) return;
    try {
      await API.put(`/admin/posts/${postId}/remove`);
      setPosts(posts.map(p => p._id === postId ? { ...p, status: 'removed' } : p));
    } catch (error) {
      alert('Failed to remove post');
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }
    
    setSendingReply(true);
    try {
      await API.post(`/messages/admin/messages/${messageId}/reply`, { 
        replyMessage: replyText 
      });
      alert('Reply sent successfully! The user will see it in their inbox.');
      setReplyingTo(null);
      setReplyText('');
      await fetchMessages();
      await fetchMessageStats();
    } catch (error) {
      alert('Failed to send reply: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSendingReply(false);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message? This action cannot be undone.')) return;
    try {
      await API.delete(`/messages/admin/messages/${messageId}`);
      setMessages(messages.filter(m => m._id !== messageId));
      await fetchMessageStats();
      alert('Message deleted successfully');
    } catch (error) {
      alert('Failed to delete message');
    }
  };

  const viewMessageDetails = (message) => {
    setSelectedMessage(message);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'replied':
        return { text: '✓ Replied', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' };
      case 'read':
        return { text: '📖 Read', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
      default:
        return { text: '⏳ Unread', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    }
  };

  return (
    <section>
      <h1 className="title">Admin Dashboard</h1>
      
      {/* Tab Buttons - FIXED for dark mode */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setTab('users')}
          style={{
            background: tab === 'users' ? 'var(--accent)' : 'transparent',
            color: tab === 'users' ? '#fff' : 'var(--text-color)',
            border: `1px solid ${tab === 'users' ? 'var(--accent)' : 'var(--border)'}`,
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
        >
          👥 Members ({users.length})
        </button>
        <button 
          onClick={() => setTab('posts')}
          style={{
            background: tab === 'posts' ? 'var(--accent)' : 'transparent',
            color: tab === 'posts' ? '#fff' : 'var(--text-color)',
            border: `1px solid ${tab === 'posts' ? 'var(--accent)' : 'var(--border)'}`,
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
        >
          📝 All Posts ({posts.length})
        </button>
        <button 
          onClick={() => { setTab('messages'); fetchMessages(); }}
          style={{
            background: tab === 'messages' ? 'var(--accent)' : 'transparent',
            color: tab === 'messages' ? '#fff' : 'var(--text-color)',
            border: `1px solid ${tab === 'messages' ? 'var(--accent)' : 'var(--border)'}`,
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit',
            position: 'relative'
          }}
        >
          📧 Contact Messages ({messages.length})
          {messageStats.unread > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-10px',
              background: '#dc2626',
              borderRadius: '50%',
              padding: '0.1rem 0.4rem',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {messageStats.unread}
            </span>
          )}
        </button>
      </div>
      
      {/* Users Tab */}
      {tab === 'users' && (
        <div className="table-container">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{ 
                      color: user.status === 'active' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {user.status}
                    </span>
                   </td>
                  <td>
                    <button 
                      onClick={() => toggleUserStatus(user._id)}
                      className="btn"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        fontSize: '0.8rem',
                        background: user.status === 'active' ? '#dc2626' : 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Posts Tab */}
      {tab === 'posts' && (
        <div className="table-container">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Action</th>
               </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.author?.name}</td>
                  <td>
                    <span style={{ 
                      color: post.status === 'published' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {post.status}
                    </span>
                  </td>
                  <td>
                    {post.status === 'published' && (
                      <button 
                        onClick={() => removePost(post._id)}
                        className="btn"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                      >
                        Remove Post
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Contact Messages Tab */}
      {tab === 'messages' && (
        <div>
          {/* Message Stats Summary */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#dc2626', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'white' }}>
              Unread: {messageStats.unread}
            </div>
            <div style={{ background: '#3b82f6', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'white' }}>
              Read: {messageStats.read}
            </div>
            <div style={{ background: '#10b981', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'white' }}>
              Replied: {messageStats.replied}
            </div>
            <div style={{ background: '#6b7280', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'white' }}>
              Total: {messageStats.total}
            </div>
          </div>

          {messages.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
              No contact messages yet.
            </p>
          ) : (
            <div className="messages-container">
              {messages.map(message => {
                const status = getStatusBadge(message.status);
                return (
                  <div 
                    key={message._id} 
                    className="details-container" 
                    style={{ 
                      textAlign: 'left', 
                      marginBottom: '1.5rem',
                      borderLeft: `4px solid ${status.color}`,
                      cursor: 'pointer',
                      background: message.status === 'unread' ? 'rgba(245, 158, 11, 0.05)' : 'var(--card-bg)'
                    }}
                    onClick={() => viewMessageDetails(message)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem' }}>{message.name}</strong>
                        <br />
                        <small style={{ color: 'var(--muted)' }}>{message.email}</small>
                        {message.userId && (
                          <span style={{ 
                            marginLeft: '0.5rem', 
                            background: 'rgba(59, 130, 246, 0.2)', 
                            padding: '0.1rem 0.3rem', 
                            borderRadius: '0.25rem',
                            fontSize: '0.7rem'
                          }}>
                            Registered User
                          </span>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          background: status.bg, 
                          color: status.color, 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '1rem',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {status.text}
                        </span>
                        <br />
                        <small style={{ color: 'var(--muted)' }}>
                          {new Date(message.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>
                    
                    <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
                      <strong>Subject:</strong> {message.subject || 'General Inquiry'}
                    </p>
                    <p style={{ lineHeight: '1.6' }}>
                      {message.message}
                    </p>
                    
                    {/* Show Admin Reply if exists */}
                    {message.reply && message.reply.message && (
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '0.75rem', 
                        background: 'rgba(34, 197, 94, 0.1)', 
                        borderRadius: '0.5rem',
                        borderLeft: '3px solid #22c55e'
                      }}>
                        <strong style={{ color: '#22c55e' }}>📧 Admin Reply:</strong>
                        <p style={{ marginTop: '0.25rem' }}>{message.reply.message}</p>
                        <small style={{ color: 'var(--muted)' }}>
                          Replied by {message.reply.repliedBy?.name || 'Admin'} on {new Date(message.reply.repliedAt).toLocaleString()}
                        </small>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                      {message.status !== 'replied' && replyingTo === message._id ? (
                        <div style={{ width: '100%' }}>
                          <textarea
                            placeholder="Type your reply here... The user will see this in their inbox."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows="3"
                            style={{ 
                              width: '100%', 
                              marginBottom: '0.5rem',
                              padding: '0.5rem',
                              borderRadius: '0.5rem',
                              border: '1px solid var(--border)',
                              background: 'var(--bg-color)',
                              color: 'var(--text-color)'
                            }}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="btn"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'none', border: '1px solid var(--border)', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--text-color)' }}
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleReply(message._id)}
                              className="btn"
                              disabled={sendingReply}
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                            >
                              {sendingReply ? 'Sending...' : 'Send Reply'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.status !== 'replied' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setReplyingTo(message._id);
                                setReplyText('');
                              }}
                              className="btn"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                            >
                              Reply
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(message._id);
                            }}
                            className="btn"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Message Details Modal */}
      {selectedMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setSelectedMessage(null)}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid var(--border)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>Message Details</h3>
            <p><strong>From:</strong> {selectedMessage.name}</p>
            <p><strong>Email:</strong> {selectedMessage.email}</p>
            <p><strong>Subject:</strong> {selectedMessage.subject || 'General Inquiry'}</p>
            <p><strong>Sent:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {getStatusBadge(selectedMessage.status).text}</p>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
            <p><strong>Message:</strong></p>
            <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{selectedMessage.message}</p>
            {selectedMessage.reply && selectedMessage.reply.message && (
              <>
                <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
                <p><strong>Admin Reply:</strong></p>
                <p style={{ marginTop: '0.5rem', lineHeight: '1.6', color: '#22c55e' }}>{selectedMessage.reply.message}</p>
                <p><small>Replied: {new Date(selectedMessage.reply.repliedAt).toLocaleString()}</small></p>
              </>
            )}
            <button 
              onClick={() => setSelectedMessage(null)}
              className="btn btn-color-1"
              style={{ marginTop: '1rem', width: '100%', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPage;