const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { mongoUrl } = require('./keys');
const port = process.env.port || 5000;
const path = require('path');
const app = express();

// Create an Express app


// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Middleware setup
app.use(cors());
app.use(express.json());

// Import Mongoose models
require('./models/model');
require('./models/post');
require('./models/story');
require('./models/message_schema');

// Import and use route handlers
app.use(require('./routes/auth'));
app.use(require('./routes/createpost'));
app.use(require('./routes/user'));
app.use(require('./routes/message'));

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event listener for successful MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('Connection established');
});

// Event listener for MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.log('Not connected', err);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make the io instance available in routes
app.set('io', io);
app.use(express.static(path.join(__dirname,'./frontend/build') ))
app.get("*",(req,res)=>{
  res.sendFile(
    path.join(__dirname,'./frontend/build/index.html'),
    function (err) {
      res.status(500).send(err)
    }
  )
})
// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
