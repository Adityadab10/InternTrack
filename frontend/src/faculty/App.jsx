import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { FacultyProvider } from './contexts/FacultyContext';
import FacultyDashboardPage from './pages/FacultyDashboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <WebSocketProvider>
        <FacultyProvider>
          <div className="App">
            <Routes>
              <Route path="/faculty-dashboard" element={<FacultyDashboardPage />} />
              <Route path="/" element={<FacultyDashboardPage />} />
            </Routes>
          </div>
        </FacultyProvider>
      </WebSocketProvider>
    </Router>
  );
}

export default App;