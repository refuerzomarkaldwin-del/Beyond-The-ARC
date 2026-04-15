import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AboutPage = () => {
  const { user } = useAuth();

  return (
    <section>
      <h1 className="title">About Beyond The ARC</h1>

      {/* Mission Section */}
      <div className="section-container">
        <div className="details-container">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M12 2L15 9H9L12 2Z" fill="var(--accent)"/>
            <path d="M5 9H19L15 22H9L5 9Z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="13" r="2" fill="var(--accent)"/>
          </svg>
          <h2>Our Mission</h2>
          <p>To create a vibrant community where basketball enthusiasts can share knowledge, inspire others, and grow together both on and off the court.</p>
        </div>

        <div className="details-container">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="3" fill="var(--accent)"/>
            <path d="M5 5L19 19M19 5L5 19" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h2>Our Vision</h2>
          <p>Building the largest online basketball community in the Philippines where every player, from beginners to pros, can find their home court.</p>
        </div>
      </div>

      {/* What We Offer Section */}
      <h2 className="title">What We Offer</h2>
      <div className="section-container">
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <path d="M22 6L12 13L2 6" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
          </svg>
          <h3>Share Your Story</h3>
          <p>Write and publish your basketball journey, game experiences, and personal achievements.</p>
        </div>
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
          </svg>
          <h3>Community Discussion</h3>
          <p>Engage in meaningful conversations through comments and reactions on posts.</p>
        </div>
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M6 11H4C3 11 2 10 2 9V7C2 6 3 5 4 5H6" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <path d="M18 11H20C21 11 22 10 22 9V7C22 6 21 5 20 5H18" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <rect x="6" y="5" width="12" height="14" rx="2" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <circle cx="9.5" cy="12" r="1.5" fill="var(--accent)"/>
            <circle cx="14.5" cy="12" r="1.5" fill="var(--accent)"/>
          </svg>
          <h3>Interactive Games</h3>
          <p>Test your memory and have fun with our basketball-themed Memory Match game.</p>
        </div>
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M12 2L15 9H9L12 2Z" fill="var(--accent)"/>
            <path d="M5 9H19L15 22H9L5 9Z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
          </svg>
          <h3>Player Recognition</h3>
          <p>Get recognized for your contributions and achievements within the community.</p>
        </div>
      </div>

      {/* Community Values Section */}
      <h2 className="title">Our Core Values</h2>
      <div className="section-container">
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <path d="M5 20V19C5 15.13 8.13 12 12 12C15.87 12 19 15.13 19 19V20" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
          </svg>
          <h3>Unity</h3>
          <p>Bringing basketball players together regardless of skill level, background, or location.</p>
        </div>
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M12 2L15 8H9L12 2Z" fill="var(--accent)"/>
            <rect x="5" y="8" width="14" height="12" rx="2" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <path d="M8 12H16M8 16H13" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h3>Growth</h3>
          <p>Continuous improvement through shared knowledge, tips, and constructive feedback.</p>
        </div>
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
            <path d="M12 8V12L15 15" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h3>Passion</h3>
          <p>Fueled by the love of basketball, we're committed to fostering genuine connections.</p>
        </div>
        <div className="details-container">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
            <path d="M12 2L15 9H9L12 2Z" fill="var(--accent)"/>
            <circle cx="12" cy="14" r="4" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
          </svg>
          <h3>Excellence</h3>
          <p>Striving for the best experience for every member of our basketball family.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', 
        borderRadius: '2rem', 
        textAlign: 'center',
        color: '#fff'
      }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem', display: 'block' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#fff" strokeWidth="1.5" fill="none"/>
          <circle cx="12" cy="12" r="3" fill="#fff"/>
          <path d="M5 5L19 19M19 5L5 19" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Ready to Join?</h2>
        <p style={{ marginBottom: '1rem', color: '#fff' }}>
          Whether you're a casual player, a competitive athlete, or a basketball coach,<br />
          Beyond The ARC welcomes you to our growing community.
        </p>
        {!user ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--accent)' }}>
              Create Free Account
            </Link>
            <Link to="/login" className="btn" style={{ background: 'transparent', border: '2px solid #fff', color: '#fff' }}>
              Login to Your Account
            </Link>
          </div>
        ) : (
          <Link to="/create-post" className="btn" style={{ background: '#fff', color: 'var(--accent)' }}>
            Share Your First Post →
          </Link>
        )}
      </div>

      {/* Motivational Quote */}
      <blockquote style={{ marginTop: '3rem', textAlign: 'center' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', marginRight: '0.5rem' }}>
          <path d="M10 11H14V17H10V11Z" fill="var(--accent)"/>
          <path d="M10 7H14V9H10V7Z" fill="var(--accent)"/>
          <path d="M4 4H20V20H4V4Z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
        </svg>
        "The ARC isn't just a platform — it's a movement. Athletic, Resilient, Committed — together we rise."
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', marginLeft: '0.5rem' }}>
          <path d="M14 13H10V7H14V13Z" fill="var(--accent)"/>
          <path d="M14 17H10V15H14V17Z" fill="var(--accent)"/>
          <path d="M20 20H4V4H20V20Z" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
        </svg>
      </blockquote>
    </section>
  );
};

export default AboutPage;