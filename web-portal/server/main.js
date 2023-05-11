const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const io = new Server({
  cors: true,
});
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const userToSocketMap = new Map();

io.on('connection', (socket) => {
  console.log("new connection");
  socket.on('join-room', (room) => {
    const { roomId, userId } = room;
    console.log(userId, 'joined room', roomId);
    userToSocketMap.set(userId, socket.id);
    socket.join(roomId);
    socket.emit('joined-room', { roomId });
    socket.broadcast.to(roomId).emit('user-connected', userId);
  });
});

io.on('disconnect', () => {
  console.log('user disconnected');
});

app.listen(8000, () => {
  console.log('listening on *:8000');
});

io.listen(8001);