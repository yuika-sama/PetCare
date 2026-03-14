import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Login from './pages/Login';
import DoctorHome from './pages/doctors/Home';
import DoctorDashboard from './pages/doctors/Dashboard';
import DoctorTickets from './pages/doctors/Tickets';
import DoctorTicketDetails from './pages/doctors/TicketDetails';
import ServiceOrder from './pages/doctors/ServiceOrder';
import RecordResult from './pages/doctors/RecordResult';
import MedicineSelector from './pages/doctors/MedicineSelector';
import Notifications from './pages/doctors/Notifications';
import TodayOrders from './pages/receptionists/TodayOrders';
import NewReception from './pages/receptionists/NewReception';
import StaffReceptionList from './pages/staffs/ReceptionList';
import StaffNotifications from './pages/staffs/Notifications';
import StaffPayment from './pages/staffs/Payment';

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
      <Route path="/doctors/record-result/:id" element={<RecordResult />} />
      <Route path="/doctors/medicine-selector" element={<MedicineSelector />} />
      <Route path="/doctors/notifications" element={<Notifications />} />
      <Route path="/receptionists/today-orders" element={<TodayOrders />} />
      <Route path="/receptionists/new-reception" element={<NewReception />} />
      <Route path="/staffs/receptions" element={<StaffReceptionList />} />
      <Route path="/staffs/notifications" element={<StaffNotifications />} />
      <Route path="/staffs/payment" element={<StaffPayment />} />
    </Routes>
  );
}

export default App;
