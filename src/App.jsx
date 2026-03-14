import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Login from './pages/Login';
import DoctorHome from './pages/doctors/Home';
import DoctorDashboard from './pages/doctors/Dashboard';
import DoctorTickets from './pages/doctors/Tickets';
import DoctorTicketDetails from './pages/doctors/TicketDetails';
import ServiceOrder from './pages/doctors/ServiceOrder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TestPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctors/home" element={<DoctorHome />} />
      <Route path="/doctors/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctors/tickets" element={<DoctorTickets />} />
      <Route path="/doctors/tickets/:id" element={<DoctorTicketDetails />} />
      <Route path="/doctors/service-order/:id" element={<ServiceOrder />} />
    </Routes>
  );
}

export default App;
