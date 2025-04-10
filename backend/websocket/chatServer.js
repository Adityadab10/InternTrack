const { Server } = require("socket.io");

function setupChatServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const userSockets = new Map(); // Using Map for better key-value handling
  const facultySockets = new Set(); // Store faculty socket IDs

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on("register_user", ({ userId, role, isFaculty }) => {
      userSockets.set(userId, socket.id);
      if (isFaculty) {
        facultySockets.add(socket.id);
      }
      console.log(`📍 Registered ${role}: ${userId} to socket ${socket.id}`);
    });

    socket.on("send_message", (data) => {
      console.log(`📤 Processing message:`, data);

      // For faculty sending messages
      if (data.senderRole === 'faculty' && data.recipientId) {
        // Send to specific student
        const studentSocketId = userSockets.get(data.recipientId);
        if (studentSocketId) {
          io.to(studentSocketId).emit("receive_message", {
            ...data,
            type: 'chat',
            timestamp: new Date(),
          });
        }
        // Send back to faculty sender
        socket.emit("receive_message", {
          ...data,
          type: 'chat',
          timestamp: new Date(),
        });
      }
      // For student sending messages
      else if (data.recipientId === 'FACULTY') {
        // Broadcast to all faculty members
        facultySockets.forEach(facultySocketId => {
          io.to(facultySocketId).emit("receive_message", {
            ...data,
            type: 'chat',
            timestamp: new Date(),
          });
        });
        
        // Send back to student sender
        const senderSocketId = userSockets.get(data.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("receive_message", {
            ...data,
            type: 'chat',
            timestamp: new Date(),
          });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
      facultySockets.delete(socket.id);
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });
}

module.exports = { setupChatServer };
