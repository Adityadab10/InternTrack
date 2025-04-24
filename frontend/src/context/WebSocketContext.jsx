// context/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5001', {
      withCredentials: true,
      transports: ['websocket']
    });

    // Set up socket event listeners
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  const registerUser = (userId, userType) => {
    if (socket) {
      socket.emit('register', { userId, userType });
      console.log('Registered user:', userId, userType);
    } else {
      console.warn('Socket not initialized yet');
    }
  };

  const sendMessage = (recipientId, message, metadata) => {
    if (socket) {
      socket.emit('send_message', {
        recipientId,
        message,
        metadata
      });
    } else {
      console.warn('Socket not initialized yet');
    }
  };

  return (
    <WebSocketContext.Provider value={{ 
      socket,
      messages,
      sendMessage,
      registerUser 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketProvider;
