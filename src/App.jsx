import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Login from './pages/Login';
import DoctorHome from './pages/doctors/Home';
import DoctorTickets from './pages/doctors/Tickets';
import DoctorTicketDetails from './pages/doctors/TicketDetails';
import ServiceOrder from './pages/doctors/ServiceOrder';
import RecordResult from './pages/doctors/RecordResult';
import MedicineSelector from './pages/doctors/MedicineSelector';
import ClinicalServices from './pages/doctors/ClinicalServices';
import ResultSummary from './pages/doctors/ResultSummary';
import Notifications from './pages/doctors/Notifications';
import TodayOrders from './pages/receptionists/TodayOrders';
import NewReception from './pages/receptionists/NewReception';
import ReceptionistNotifications from './pages/receptionists/Notifications';
import ReceptionistPayment from './pages/receptionists/Payment';
import TechHome from './pages/techStaffs/Home';
import TechRecordResult from './pages/techStaffs/RecordResult';
import {RequireAuth, RequireRole} from './routes/routeGuard';

function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/" element={<TestPage />} />
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={['DOCTOR']} />}>
          <Route path="/doctors/home" element={<DoctorHome />} />
          <Route path="/doctors/tickets" element={<DoctorTickets />} />
          <Route path="/doctors/tickets/:id" element={<DoctorTicketDetails />} />
          <Route path="/doctors/service-order/:id" element={<ServiceOrder />} />
          <Route path="/doctors/record-result/:id" element={<RecordResult />} />
          <Route path="/doctors/medicine-selector" element={<MedicineSelector />} />
          <Route path="/doctors/clinical-services" element={<ClinicalServices />} />
          <Route path="/doctors/result-summary" element={<ResultSummary />} />
          <Route path="/doctors/notifications" element={<Notifications />} />
        </Route>
        <Route element={<RequireRole allowedRoles={['RECEPTIONIST', 'STAFF']} />}>
          <Route path="/receptionists/today-orders" element={<TodayOrders />} />
          <Route path="/receptionists/new-reception" element={<NewReception />} />
          <Route path="/receptionists/notifications" element={<ReceptionistNotifications />} />
          <Route path="/receptionists/payment" element={<ReceptionistPayment />} />
        </Route>
        <Route element={<RequireRole allowedRoles={['TECH']} />}>
          <Route path="/techs/home" element={<TechHome />} />
          <Route path="/techs/record-result/:id" element={<TechRecordResult />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
