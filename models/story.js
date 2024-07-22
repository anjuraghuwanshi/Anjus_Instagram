const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'USER', required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: '24h' } }
});

mongoose.model('STORY', storySchema);
