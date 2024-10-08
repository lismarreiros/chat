import express from 'express';
import path from 'path';
import http, { get } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { formatMessage } from './utils/messages.js';
import { userJoin, getCurrentUser, userLeaves, getRoomUsers } from './utils/users.js';

const app = express();

// Converter import.meta.url para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);
const io = new Server(server); 

app.use(express.static(path.join(__dirname, 'public')));
const botName = 'ChatCord Bot';

// Run when a client connects
io.on('connection', (socket) => { 
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)

    // welcome user 
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
    
    // broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    // Send users and info room
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  })

  // listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    io
      .to(user.room)
      .emit('message', formatMessage(user.username, msg));
  })

  // runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeaves(socket.id)
    if(user) {
      io
      .to(user.room)
      .emit('message', formatMessage(botName, `${user.username} has left the chat`));

      // send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  })
})

const PORT = 3000 || process.env.PORT

// set static folder
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));