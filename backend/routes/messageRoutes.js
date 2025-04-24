const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get conversation between two users
router.get('/:senderId/:recipientId', async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId }
      ]
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Store a new message
router.post('/', async (req, res) => {
  try {
    const { senderId, recipientId, content, messageType } = req.body;
    
    const newMessage = new Message({
      senderId,
      recipientId,
      content,
      messageType,
      timestamp: new Date()
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({ message: 'Error storing message' });
  }
});

module.exports = router; 