import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      color: '#fff',
      padding: '3rem 2rem 1rem',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        
        {/* Logo and Description */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            {/* Basketball Logo Icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="12" r="3" fill="var(--accent)"/>
              <path d="M5 5L19 19M19 5L5 19" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <h3 style={{ color: 'var(--accent)', margin: 0 }}>Beyond The ARC</h3>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#ccc' }}>
            Your home for basketball stories, tips, and community discussions. 
            Join our growing family of basketball enthusiasts from around the world.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {/* Facebook Icon */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
               style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#1877f2'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
              </svg>
            </a>
            
            {/* Twitter/X Icon */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
               style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#1da1f2'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            {/* Instagram Icon */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
               style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#e4405f'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/>
                <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
              </svg>
            </a>
            
            {/* YouTube Icon */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
               style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#ff0000'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.582 6.186c-.23-.86-.908-1.538-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418c-.86.23-1.538.908-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.86.908 1.538 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418c.86-.23 1.538-.908 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.5v-7l6 3.5-6 3.5z"/>
              </svg>
            </a>
            
            {/* Discord Icon */}
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer"
               style={{ color: '#ccc', transition: 'color 0.3s', display: 'inline-flex' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#5865f2'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.356 0c-.166-.386-.4-.875-.61-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.68 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.125-.094.251-.19.371-.285a.078.078 0 0 1 .068-.016c3.93 1.793 8.18 1.793 12.062 0a.076.076 0 0 1 .069.016c.12.094.246.19.371.285a.077.077 0 0 1-.008.128 13.08 13.08 0 0 1-1.872.892.076.076 0 0 0-.041.106c.352.699.764 1.364 1.226 1.994a.077.077 0 0 0 .084.028 19.89 19.89 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.027zM8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links with SVG Icons */}
        <div>
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link to="/home" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 3L21 9L12 15L3 9Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M5 10.5V19H19V10.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                Home
              </Link>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link to="/about" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                About Us
              </Link>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link to="/contact" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                Contact
              </Link>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link to="/game" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 11H4C3 11 2 10 2 9V7C2 6 3 5 4 5H6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M18 11H20C21 11 22 10 22 9V7C22 6 21 5 20 5H18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="6" y="5" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="9.5" cy="12" r="1.5" fill="currentColor"/>
                  <circle cx="14.5" cy="12" r="1.5" fill="currentColor"/>
                </svg>
                Memory Game
              </Link>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <Link to="/create-post" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                Write Post
              </Link>
            </li>
          </ul>
        </div>

        {/* Community Stats with SVG Icons */}
        <div>
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Community</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M5 20V19C5 15.13 8.13 12 12 12C15.87 12 19 15.13 19 19V20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span>500+ Active Members</span>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span>100+ Basketball Stories</span>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span>1,000+ Comments</span>
            </li>
            <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span>5,000+ Reactions</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Stay Updated</h3>
          <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '1rem' }}>
            Get the latest basketball tips, community updates, and event announcements.
          </p>
          {subscribed ? (
            <div style={{ 
              background: 'rgba(76, 175, 80, 0.2)', 
              padding: '0.75rem', 
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              ✅ Thanks for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
              >
                Subscribe → 
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '1.5rem',
        marginTop: '1rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#888'
      }}>
        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>"The ARC stands for Athletic, Resilient, and Committed"</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          © 2026 Beyond The ARC. All Rights Reserved. | Built with ❤️ for basketball lovers
        </div>
        
        {/* Disclaimer for Image Credits */}
        <div style={{ 
          fontSize: '0.7rem', 
          marginTop: '1rem', 
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          color: '#666'
        }}>
          📷 Disclaimer: Some images used in this project are for educational/demonstration purposes only 
          and sourced from free stock websites (Unsplash, Pexels, Pixabay). 
          No copyright infringement intended. 
          <button 
            onClick={() => {
              alert('Image Credits:\n\n- Profile images: Free stock photos\n- Backgrounds: Free stock images\n- Icons: Social media brand assets\n- Logo: Custom design\n\nAll images used for educational purposes only.');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              textDecoration: 'underline',
              cursor: 'pointer',
              marginLeft: '0.25rem',
              fontSize: '0.7rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            View Credits
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;