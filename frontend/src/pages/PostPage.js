import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [reactionCounts, setReactionCounts] = useState({
    like: 0,
    heart: 0,
    wow: 0,
    sad: 0,
    angry: 0
  });

  // Reaction icons and labels
  const reactions = [
    { type: 'like', icon: '👍', label: 'Like', color: '#3b82f6' },
    { type: 'heart', icon: '❤️', label: 'Love', color: '#ef4444' },
    { type: 'wow', icon: '😲', label: 'Wow', color: '#f59e0b' },
    { type: 'sad', icon: '😢', label: 'Sad', color: '#8b5cf6' },
    { type: 'angry', icon: '😠', label: 'Angry', color: '#dc2626' }
  ];

  useEffect(() => {
    fetchPostAndComments();
    loadReactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        API.get(`/posts/${id}`),
        API.get(`/comments/${id}`)
      ]);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const loadReactions = () => {
    // Load reactions from localStorage
    const savedReactions = JSON.parse(localStorage.getItem(`reactions_${id}`) || '{}');
    setReactionCounts(savedReactions.counts || {
      like: 0,
      heart: 0,
      wow: 0,
      sad: 0,
      angry: 0
    });
    setUserReaction(savedReactions.userReaction || null);
  };

  const saveReaction = (reactionType) => {
    if (!user) {
      alert('Please login to react to this post');
      return;
    }

    let newCounts = { ...reactionCounts };
    
    // Remove previous reaction if exists
    if (userReaction) {
      newCounts[userReaction] = Math.max(0, newCounts[userReaction] - 1);
    }
    
    // Add new reaction (if not same as previous)
    let newUserReaction = reactionType;
    if (userReaction === reactionType) {
      // User is removing their reaction
      newUserReaction = null;
    } else {
      // Add new reaction
      newCounts[reactionType] = newCounts[reactionType] + 1;
    }
    
    // Save to localStorage
    const reactionsData = {
      counts: newCounts,
      userReaction: newUserReaction
    };
    localStorage.setItem(`reactions_${id}`, JSON.stringify(reactionsData));
    
    // Update state
    setReactionCounts(newCounts);
    setUserReaction(newUserReaction);
    setShowReactions(false);
  };

  const getTotalReactions = () => {
    return Object.values(reactionCounts).reduce((a, b) => a + b, 0);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    
    try {
      const { data } = await API.post(`/comments/${id}`, { body: commentBody });
      setComments([...comments, data]);
      setCommentBody('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await API.delete(`/posts/${id}`);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1); // This goes back to the previous page in history
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '4rem' }}>Loading post...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>{error}</p>;
  if (!post) return <p style={{ textAlign: 'center', padding: '4rem' }}>Post not found</p>;

  const isOwner = user && post.author && user._id === post.author._id;
  const isAdmin = user && user.role === 'admin';
  const totalReactions = getTotalReactions();

  // Get the top reaction for display
  const getTopReaction = () => {
    const entries = Object.entries(reactionCounts);
    const top = entries.reduce((max, entry) => entry[1] > max[1] ? entry : max, ['', 0]);
    if (top[1] === 0) return null;
    const reaction = reactions.find(r => r.type === top[0]);
    return reaction;
  };

  const topReaction = getTopReaction();

  return (
    <section>
      {/* Back Button - Goes to previous page */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={handleGoBack}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '2rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            color: 'var(--text-color)',
            backgroundColor: 'var(--card-bg)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--card-bg)';
            e.currentTarget.style.color = 'var(--text-color)';
          }}
        >
          ← Back
        </button>
      </div>

      {post.image && (
        <img 
          src={`http://localhost:5000/uploads/${post.image}`}
          alt={post.title}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '2rem' }}
        />
      )}
      
      <h1 className="title">{post.title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
      </p>
      
      {/* Reactions Section */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto 2rem auto', 
        textAlign: 'center',
        padding: '1rem',
        background: 'var(--card-bg)',
        borderRadius: '1rem',
        border: '1px solid var(--border)'
      }}>
        {/* Reaction Button Area */}
        {user ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-color)'
              }}
            >
              {userReaction ? (
                <>
                  {reactions.find(r => r.type === userReaction)?.icon} 
                  {reactions.find(r => r.type === userReaction)?.label}
                </>
              ) : (
                <>👍 React</>
              )}
              {totalReactions > 0 && (
                <span style={{ 
                  marginLeft: '0.5rem', 
                  background: 'var(--accent)', 
                  borderRadius: '1rem', 
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.75rem'
                }}>
                  {totalReactions}
                </span>
              )}
            </button>
            
            {/* Reaction Picker Popup */}
            {showReactions && (
              <div
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                style={{
                  position: 'absolute',
                  top: '-60px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--card-bg)',
                  borderRadius: '2rem',
                  padding: '0.5rem',
                  display: 'flex',
                  gap: '0.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  border: '1px solid var(--border)',
                  zIndex: 100
                }}
              >
                {reactions.map(reaction => (
                  <button
                    key={reaction.type}
                    onClick={() => saveReaction(reaction.type)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      transition: 'transform 0.2s',
                      opacity: userReaction === reaction.type ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={reaction.label}
                  >
                    {reaction.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '0.5rem', color: 'var(--muted)' }}>
              {totalReactions > 0 ? (
                <>
                  {topReaction && `${topReaction.icon} ${totalReactions} people reacted`}
                </>
              ) : (
                'Be the first to react!'
              )}
            </p>
            <Link to="/login" style={{ fontSize: '0.9rem' }}>
              Login to react
            </Link>
          </div>
        )}
        
        {/* Reaction Summary Bar */}
        {totalReactions > 0 && (
          <div style={{ 
            marginTop: '1rem', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            flexWrap: 'wrap',
            borderTop: '1px solid var(--border)',
            paddingTop: '1rem'
          }}>
            {reactions.map(reaction => (
              reactionCounts[reaction.type] > 0 && (
                <div key={reaction.type} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>{reaction.icon}</span>
                  <span style={{ fontSize: '0.85rem' }}>{reactionCounts[reaction.type]}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
      
      {(isOwner || isAdmin) && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <Link to={`/edit-post/${post._id}`} className="btn btn-color-2">Edit Post</Link>
          <button onClick={handleDeletePost} className="btn btn-color-1" style={{ background: '#dc2626', borderColor: '#dc2626' }}>
            Delete Post
          </button>
        </div>
      )}
      
      <div className="post-body" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
        {post.body.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      
      {/* Comments Section */}
      <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
        <h3 className="title" style={{ fontSize: '1.8rem' }}>
          Comments ({comments.length})
        </h3>
        
        {/* Comment Form - Only for logged-in users */}
        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
            <textarea
              placeholder="Share your thoughts about this post..."
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              rows="3"
              required
            />
            <button className="btn btn-color-1" type="submit">Post Comment</button>
          </form>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            background: 'var(--card-bg)', 
            borderRadius: '1rem',
            marginBottom: '2rem'
          }}>
            <p>💬 Want to join the conversation?</p>
            <Link to="/login" className="btn btn-color-1" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Login to Comment
            </Link>
          </div>
        )}
        
        {/* Comments List */}
        {comments.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No comments yet. Be the first!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} style={{ 
              background: 'var(--card-bg)', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid var(--border)'
            }}>
              <p>
                <strong>{comment.author?.name}</strong> 
                <small style={{ marginLeft: '0.5rem', color: 'var(--muted)' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </small>
              </p>
              <p>{comment.body}</p>
              {/* Delete comment - Only for comment owner or admin */}
              {(user?._id === comment.author?._id || isAdmin) && (
                <button 
                  onClick={() => handleDeleteComment(comment._id)}
                  style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Delete Comment
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PostPage;