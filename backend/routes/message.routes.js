const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// Public route - Submit contact form (no authentication needed)
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    
    // Check if user is registered
    let userId = null;
    const user = await User.findOne({ email });
    if (user) {
      userId = user._id;
    }
    
    const newMessage = await Message.create({
      name,
      email,
      userId,
      subject: subject || 'General Inquiry',
      message,
      status: 'unread'
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.',
      data: newMessage
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: error.message });
  }
});

// User - Get my own messages (for logged in users)
router.get('/my-messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ 
      userId: req.user._id 
    }).sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User - Get unread message count
router.get('/my-messages/unread/count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({ 
      userId: req.user._id,
      status: 'unread'
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User - Mark message as read
router.put('/my-messages/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    message.status = 'read';
    await message.save();
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin only - Get all messages
router.get('/admin/messages', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    
    const messages = await Message.find(filter)
      .populate('userId', 'name email')
      .populate('reply.repliedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Message.countDocuments(filter);
    
    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin only - Reply to message
router.post('/admin/messages/:id/reply', protect, adminOnly, async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    message.reply = {
      message: replyMessage,
      repliedBy: req.user._id,
      repliedAt: new Date()
    };
    message.status = 'replied';
    
    await message.save();
    
    // Create a notification message for the user (as a new message in their inbox)
    if (message.userId) {
      await Message.create({
        name: 'Beyond The ARC Admin',
        email: 'admin@thefolio.com',
        userId: message.userId,
        subject: `RE: ${message.subject}`,
        message: replyMessage,
        isFromAdmin: true,
        status: 'unread'
      });
    }
    
    res.json({ success: true, message: 'Reply sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin only - Delete message
router.delete('/admin/messages/:id', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin only - Get message statistics
router.get('/admin/messages/stats/summary', protect, adminOnly, async (req, res) => {
  try {
    const unread = await Message.countDocuments({ status: 'unread' });
    const read = await Message.countDocuments({ status: 'read' });
    const replied = await Message.countDocuments({ status: 'replied' });
    const total = await Message.countDocuments();
    
    res.json({ unread, read, replied, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;