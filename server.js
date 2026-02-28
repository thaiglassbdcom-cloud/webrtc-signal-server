const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('✅ connected:', socket.id);
  
  socket.on('offer', (data) => {
    socket.broadcast.emit('newOffer', { from: socket.id, offer: data.offer });
  });
  
  socket.on('answer', (data) => {
    io.to(data.toSocketId).emit('newAnswer', { answer: data.answer });
  });
  
  socket.on('disconnect', () => {
    console.log('❌ disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Signalling server running on port ${PORT}`);
});
