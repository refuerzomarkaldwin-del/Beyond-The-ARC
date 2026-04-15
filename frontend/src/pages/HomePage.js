import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import basketballHero from '../assets/images/basketball-hero.jpg';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsCount, setCommentsCount] = useState({});
  const [reactionsCount, setReactionsCount] = useState({});
  const [showShareMenu, setShowShareMenu] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/uploads/${imagePath}`;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
      
      const commentsData = {};
      const reactionsData = {};
      
      for (const post of data) {
        try {
          const commentsRes = await API.get(`/comments/${post._id}`);
          commentsData[post._id] = commentsRes.data.length;
          
          const savedReactions = JSON.parse(localStorage.getItem(`reactions_${post._id}`) || '{}');
          const counts = savedReactions.counts || { like: 0, heart: 0, wow: 0, sad: 0, angry: 0 };
          const total = Object.values(counts).reduce((a, b) => a + b, 0);
          reactionsData[post._id] = total;
        } catch (err) {
          commentsData[post._id] = 0;
          reactionsData[post._id] = 0;
        }
      }
      
      setCommentsCount(commentsData);
      setReactionsCount(reactionsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalReactions = (postId) => {
    return reactionsCount[postId] || 0;
  };

  const getTopReaction = (postId) => {
    const savedReactions = JSON.parse(localStorage.getItem(`reactions_${postId}`) || '{}');
    const counts = savedReactions.counts || { like: 0, heart: 0, wow: 0, sad: 0, angry: 0 };
    const reactions = [
      { type: 'like', icon: '👍', count: counts.like },
      { type: 'heart', icon: '❤️', count: counts.heart },
      { type: 'wow', icon: '😲', count: counts.wow },
      { type: 'sad', icon: '😢', count: counts.sad },
      { type: 'angry', icon: '😠', count: counts.angry }
    ];
    const top = reactions.reduce((max, r) => r.count > max.count ? r : max, { count: 0, icon: '👍' });
    return top.count > 0 ? top.icon : null;
  };

  const handleReactionClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleCommentClick = (postId) => {
    navigate(`/posts/${postId}#comments`);
  };

  const handleShare = async (postId, postTitle, platform) => {
    const shareUrl = `${window.location.origin}/posts/${postId}`;
    const shareText = `Check out "${postTitle}" on Beyond The ARC!`;

    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        } catch (err) {
          alert('Failed to copy link');
        }
        break;
      default:
        break;
    }
    setShowShareMenu(null);
  };

  const toggleShareMenu = (postId) => {
    setShowShareMenu(showShareMenu === postId ? null : postId);
  };

  return (
    <>
      {/* Hero Section with Image - ONLY SHOW FOR GUESTS (NOT LOGGED IN) */}
      {!user && (
        <section style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.9))',
          borderRadius: '2rem',
          margin: '2rem auto',
          maxWidth: '1200px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${basketballHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            zIndex: 0
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              Welcome to Beyond The ARC
            </h1>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto' }}>
              Your home for basketball stories, tips, and community discussions
            </p>
            
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              background: 'rgba(255, 153, 51, 0.2)', 
              borderRadius: '1rem',
              display: 'inline-block'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ display: 'inline', marginRight: '0.5rem' }}>
                <path d="M10 11H14V17H10V11Z"/>
                <path d="M10 7H14V9H10V7Z"/>
                <path d="M4 4H20V20H4V4Z"/>
              </svg>
              <p style={{ fontStyle: 'italic', fontSize: '1rem', display: 'inline' }}>
                "The only way to prove you are a good player is to play with others who are better than you."
              </p>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ display: 'inline', marginLeft: '0.5rem' }}>
                <path d="M14 13H10V7H14V13Z"/>
                <path d="M14 17H10V15H14V17Z"/>
                <path d="M20 20H4V4H20V20Z"/>
              </svg>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>- Michael Jordan</p>
            </div>
          </div>
        </section>
      )}

      {/* Personalized Welcome Section for Logged-in Users - UPGRADED */}
      {user && (
        <section style={{ 
          textAlign: 'center', 
          padding: '2rem',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: '2rem',
          margin: '2rem auto',
          maxWidth: '1200px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 153, 51, 0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 10% 20%, rgba(255, 153, 51, 0.05) 2px, transparent 2px)`,
            backgroundSize: '30px 30px',
            pointerEvents: 'none'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              animation: 'bounce 2s ease-in-out infinite',
              display: 'inline-block',
              marginBottom: '0.5rem'
            }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="var(--accent)" strokeWidth="1.5" fill="rgba(255, 153, 51, 0.1)"/>
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="9" cy="10" r="1.5" fill="var(--accent)"/>
                <circle cx="15" cy="10" r="1.5" fill="var(--accent)"/>
              </svg>
            </div>
            
            <h2 style={{ 
              color: '#fff', 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Welcome Back, {user.name}! 🎉
            </h2>
            
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'rgba(255,255,255,0.9)', 
              marginBottom: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto 1.5rem auto'
            }}>
              Ready to make your next move? Share your basketball journey and inspire the community!
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              marginTop: '0.5rem' 
            }}>
              <Link 
                to="/create-post" 
                style={{ 
                  background: 'var(--accent)', 
                  color: '#1a1a2e', 
                  fontWeight: 'bold', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  borderRadius: '3rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 153, 51, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5V19M5 12H19"/>
                </svg>
                Write Your Story
              </Link>
              
              <Link 
                to="/profile" 
                style={{ 
                  background: 'transparent', 
                  border: '2px solid var(--accent)', 
                  color: '#fff', 
                  fontWeight: 'bold', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  borderRadius: '3rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 153, 51, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Edit Profile
              </Link>
              
              <Link 
                to="/game" 
                style={{ 
                  background: 'transparent', 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  color: '#fff', 
                  fontWeight: 'bold', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  borderRadius: '3rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 11h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z"/>
                  <path d="M18 11h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z"/>
                  <rect x="6" y="5" width="12" height="14" rx="2"/>
                  <circle cx="9.5" cy="12" r="1.5" fill="var(--accent)"/>
                  <circle cx="14.5" cy="12" r="1.5" fill="var(--accent)"/>
                </svg>
                Play Game
              </Link>
            </div>
            
            <div style={{ 
              marginTop: '1.5rem', 
              fontSize: '0.85rem', 
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15 9H9L12 2z"/>
              </svg>
              <span>Your voice matters. Every story inspires someone!</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15 9H9L12 2z"/>
              </svg>
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts Section */}
      <section>
        <h2 className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
            <path d="M22 6L12 13L2 6"/>
          </svg>
          {user ? 'Latest from Your Community' : 'Latest from the Community'}
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ margin: '0 auto 1rem', display: 'block' }}>
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
              <path d="M22 6L12 13L2 6"/>
            </svg>
            <p>No posts yet. Be the first to share your basketball story!</p>
            {!user && (
              <Link to="/login" className="btn btn-color-1" style={{ marginTop: '1rem', display: 'inline-block' }}>
                Login to Write a Post
              </Link>
            )}
            {user && (
              <Link to="/create-post" className="btn btn-color-1" style={{ marginTop: '1rem', display: 'inline-block' }}>
                Create the First Post! 🎉
              </Link>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post._id} className="details-container" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {post.image && (
                  <img 
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '1rem' }}
                  />
                )}
                
                <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <small>
                    By <strong>{post.author?.name}</strong> • {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                </div>
                
                <div className="post-body" style={{ marginBottom: '1rem', lineHeight: '1.6', flex: 1 }}>
                  {post.body.split('\n').map((paragraph, i) => (
                    <p key={i} style={{ marginBottom: '0.5rem' }}>{paragraph}</p>
                  ))}
                </div>
                
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleReactionClick(post._id)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        transition: 'all 0.3s ease',
                        color: 'var(--text-color)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 153, 51, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span>{getTopReaction(post._id) || '👍'}</span>
                      <span style={{ fontSize: '0.85rem' }}>{getTotalReactions(post._id)}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleCommentClick(post._id)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        transition: 'all 0.3s ease',
                        color: 'var(--text-color)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 153, 51, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"/>
                      </svg>
                      <span style={{ fontSize: '0.85rem' }}>{commentsCount[post._id] || 0}</span>
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={() => toggleShareMenu(post._id)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.25rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '1rem',
                          transition: 'all 0.3s ease',
                          color: 'var(--text-color)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 153, 51, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12V20H20V12M12 2V15M12 15L15 12M12 15L9 12" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: '0.85rem' }}>Share</span>
                      </button>
                      
                      {showShareMenu === post._id && (
                        <div style={{
                          position: 'absolute',
                          bottom: '30px',
                          right: 0,
                          background: 'var(--card-bg)',
                          borderRadius: '0.75rem',
                          padding: '0.5rem',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                          border: '1px solid var(--border)',
                          zIndex: 100,
                          minWidth: '140px'
                        }}>
                          <button
                            onClick={() => handleShare(post._id, post.title, 'facebook')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              width: '100%',
                              padding: '0.6rem 0.75rem',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '0.5rem',
                              color: 'var(--text-color)',
                              fontSize: '0.85rem',
                              transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                            </svg>
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare(post._id, post.title, 'twitter')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              width: '100%',
                              padding: '0.6rem 0.75rem',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '0.5rem',
                              color: 'var(--text-color)',
                              fontSize: '0.85rem',
                              transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/>
                            </svg>
                            Twitter/X
                          </button>
                          <button
                            onClick={() => handleShare(post._id, post.title, 'copy')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              width: '100%',
                              padding: '0.6rem 0.75rem',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '0.5rem',
                              color: 'var(--text-color)',
                              fontSize: '0.85rem',
                              transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy Link
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <Link to={`/posts/${post._id}`} style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      View full post
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Why Join Section - Only for guests */}
      {!user && (
        <section style={{ background: 'var(--card-bg)', borderRadius: '2rem', margin: '2rem auto', maxWidth: '1200px', padding: '2rem' }}>
          <h2 className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="M5 5L19 19M19 5L5 19"/>
            </svg>
            Why Choose Beyond The ARC?
          </h2>
          
          <div className="section-container">
            <div className="details-container">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
                <path d="M22 6L12 13L2 6"/>
              </svg>
              <h3>Share Your Journey</h3>
              <p>Document your basketball progress, share game experiences, and inspire others with your story.</p>
            </div>
            
            <div className="details-container">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"/>
              </svg>
              <h3>Community Engagement</h3>
              <p>Connect with fellow players, coaches, and basketball enthusiasts who share your passion.</p>
            </div>
            
            <div className="details-container">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                <path d="M12 2L15 8H9L12 2Z" fill="var(--accent)"/>
                <rect x="5" y="8" width="14" height="12" rx="2" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
                <path d="M8 12H16M8 16H13" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <h3>Learn & Improve</h3>
              <p>Discover training tips, drills, and strategies from experienced players to elevate your game.</p>
            </div>
            
            <div className="details-container">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
                <path d="M12 2L15 9H9L12 2Z" fill="var(--accent)"/>
                <path d="M5 9H19L15 22H9L5 9Z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
              </svg>
              <h3>Celebrate Achievements</h3>
              <p>Share your wins, milestones, and personal records with a supportive community.</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4l3 3"/>
              </svg>
              Ready to be part of something special? Join our growing basketball family today!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-color-1">Create Free Account</Link>
              <Link to="/login" className="btn btn-color-2">Login to Your Account</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;