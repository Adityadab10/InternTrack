import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket('wss://your-backend-websocket-url');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'notification') {
        setNotifications(prev => [...prev, message]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setSocket(null);
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const sendFeedback = (feedbackData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'feedback',
        data: feedbackData
      }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, notifications, sendFeedback }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);