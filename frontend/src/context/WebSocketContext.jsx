// context/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5001');

    socketRef.current.on('connect', () => {
      console.log('🟢 Connected to WebSocket');
    });

    socketRef.current.on('receive_message', (data) => {
      console.log('📨 Message received:', data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const registerUser = (id, role) => {
    setUserId(id);
    setUserRole(role);
    socketRef.current.emit('register_user', { 
      userId: id, 
      role,
      isFaculty: role === 'faculty'
    });
  };

  const sendMessage = (recipientId, message, metadata = {}) => {
    const messageData = {
      senderId: userId,
      recipientId,
      message,
      ...metadata,
      timestamp: new Date(),
    };
    console.log('Sending message:', messageData);
    socketRef.current.emit('send_message', messageData);
    setMessages((prev) => [...prev, messageData]);
  };

  return (
    <WebSocketContext.Provider value={{
      messages,
      sendMessage,
      registerUser,
      userRole,
      userId
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
