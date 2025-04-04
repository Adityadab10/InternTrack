const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

class ChatServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // stores all connected clients

    this.wss.on('connection', (ws) => {
      const clientId = uuidv4();
      
      // Handle initial connection
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          
          // Handle user registration
          if (data.type === 'register') {
            this.clients.set(data.userId, {
              ws,
              role: data.role,
              userId: data.userId
            });
            console.log(`Client registered: ${data.userId} as ${data.role}`);
          }
          
          // Handle chat messages
          if (data.type === 'chat') {
            const recipient = this.clients.get(data.recipientId);
            if (recipient) {
              recipient.ws.send(JSON.stringify({
                type: 'chat',
                message: data.message,
                senderId: data.senderId,
                senderName: data.senderName,
                timestamp: new Date().toISOString()
              }));
            }
          }
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });

      // Handle client disconnection
      ws.on('close', () => {
        for (const [userId, client] of this.clients.entries()) {
          if (client.ws === ws) {
            this.clients.delete(userId);
            console.log(`Client disconnected: ${userId}`);
            break;
          }
        }
      });
    });
  }
}

module.exports = ChatServer; 