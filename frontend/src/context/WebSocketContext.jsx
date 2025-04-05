import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext({
  messages: [],
  sendMessage: null,
  registerUser: null,
  connected: false
});

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket('ws://localhost:5000');
      
      ws.onopen = () => {
        console.log('WebSocket Connected');
        setSocket(ws);
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'chat') {
            setMessages(prev => [...prev, message]);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setSocket(null);
        setConnected(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setSocket(null);
        setConnected(false);
      };
    } catch (error) {
      console.error('WebSocket Connection Error:', error);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = (recipientId, message, senderName) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log('WebSocket is not connected');
      return;
    }

    const messageData = {
      type: 'chat',
      recipientId,
      message,
      senderId: localStorage.getItem('userId'),
      senderName,
      timestamp: new Date().toISOString()
    };

    try {
      socket.send(JSON.stringify(messageData));
      setMessages(prev => [...prev, messageData]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const registerUser = (userId, role) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log('WebSocket is not connected');
      return;
    }

    try {
      socket.send(JSON.stringify({
        type: 'register',
        userId,
        role
      }));
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <WebSocketContext.Provider value={{
      messages,
      sendMessage,
      registerUser,
      connected
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    console.warn('useWebSocket must be used within a WebSocketProvider');
    return {
      messages: [],
      sendMessage: () => {},
      registerUser: () => {},
      connected: false
    };
  }
  return context;
};