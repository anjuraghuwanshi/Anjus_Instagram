const express = require('express');
const mongoose = require('mongoose');
const requireLogin = require('../requireLogin');

const router = express.Router();
const Message = mongoose.model('Message');

// Send a message
router.post('/message', requireLogin, (req, res) => {
  const { recipientId, text } = req.body;

  if (!recipientId || !text) {
    return res.status(422).json({ error: 'Please provide recipient and message text' });
  }

  const message = new Message({
    sender: req.user._id,
    recipient: recipientId,
    text
  });

  message.save()
    .then(result => {
      res.json({ message: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to send message' });
    });
});

// Get messages for a specific user
router.get('/messages/:recipientId', requireLogin, (req, res) => {
  const { recipientId } = req.params;

  Message.find({
    $or: [
      { sender: req.user._id, recipient: recipientId },
      { sender: recipientId, recipient: req.user._id }
    ]
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'username photo')
    .populate('recipient', 'username photo')
    .populate('text')
    .then(messages => {
      res.json({ messages });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to fetch messages' });
    });
});

module.exports = router;
