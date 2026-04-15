require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
const messageRoutes = require('./routes/message.routes'); // ADD THIS LINE

const app = express();

// Connect to MongoDB FIRST
connectDB();

// Middleware - ORDER MATTERS!
// UPDATED CORS to allow both localhost AND your live Vercel URL
app.use(cors({ 
  origin: [ 
    'http://localhost:3000',                    // Local development
    'https://beyond-the-arc-topaz.vercel.app'   // Your live Vercel URL
  ], 
  credentials: true 
}));
app.use(express.json());  // This MUST be before routes
app.use(express.urlencoded({ extended: true })); // Add this for form data
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes); // ADD THIS LINE

// Error handler (add this at the END)
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});