const socketIo = require('socket.io');

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('register', ({ userId, userType }) => {
      connectedUsers.set(userId, socket.id);
      console.log(`${userType} registered:`, userId);
    });

    socket.on('send_message', async ({ recipientId, message, metadata }) => {
      const recipientSocketId = connectedUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', {
          message,
          ...metadata,
          timestamp: new Date()
        });
      }
    });

    socket.on('disconnect', () => {
      // Remove user from connected users
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log('User disconnected:', userId);
          break;
        }
      }
    });
  });

  return io;
};

module.exports = setupSocket;
