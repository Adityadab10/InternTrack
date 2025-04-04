import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './WebSocketContext';
import { FacultyProvider } from './FacultyContext';
import FacultyDashboardPage from './FacultyDashboardPage';
import './App.css';

function Da() {
  return (
    <Router>
        <FacultyProvider>
          <div className="App">
            <Routes>
              <Route path="/faculty-dashboard" element={<FacultyDashboardPage />} />
            </Routes>
          </div>
        </FacultyProvider>
    </Router>
  );
}

export default Da;