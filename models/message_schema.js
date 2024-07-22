const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
  sender: { type: ObjectId, ref: 'USER', required: true },
  recipient: { type: ObjectId, ref: 'USER', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

mongoose.model('Message', messageSchema);
