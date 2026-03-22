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
import ClinicalQueue from './pages/receptionists/ClinicalQueue';
import ReceptionistAdvancePayments from './pages/receptionists/AdvancePayments';
import DoctorPatientHistory from './pages/doctors/PatientHistory';
import DoctorTreatmentPlans from './pages/doctors/TreatmentPlans';
import DoctorTreatmentPlanDetail from './pages/doctors/TreatmentPlanDetail';
import StaffReceptionList from './pages/staffs/ReceptionList';
import StaffNotifications from './pages/staffs/Notifications';
import StaffPayment from './pages/staffs/Payment';
import StaffReceiptList from './pages/staffs/ReceiptList';
import StaffReceiptDetail from './pages/staffs/ReceiptDetail';
import StaffAdvancePayments from './pages/staffs/AdvancePaymentManagement';
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
          <Route path="/doctors/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctors/tickets" element={<DoctorTickets />} />
          <Route path="/doctors/tickets/:id" element={<DoctorTicketDetails />} />
          <Route path="/doctors/service-order/:id" element={<ServiceOrder />} />
          <Route path="/doctors/record-result/:id" element={<RecordResult />} />
          <Route path="/doctors/medicine-selector" element={<MedicineSelector />} />
          <Route path="/doctors/notifications" element={<Notifications />} />
          <Route path="/doctors/patient-history" element={<DoctorPatientHistory />} />
          <Route path="/doctors/treatment-plans" element={<DoctorTreatmentPlans />} />
          <Route path="/doctors/treatment-plans/new" element={<DoctorTreatmentPlanDetail />} />
          <Route path="/doctors/treatment-plans/:id" element={<DoctorTreatmentPlanDetail />} />
        </Route>
        <Route element={<RequireRole allowedRoles={['RECEPTIONIST']} />}>
          <Route path="/receptionists/today-orders" element={<TodayOrders />} />
          <Route path="/receptionists/new-reception" element={<NewReception />} />
          <Route path="/receptionists/clinical-queue" element={<ClinicalQueue />} />
          <Route path="/receptionists/advance-payments" element={<ReceptionistAdvancePayments />} />
        </Route>
        <Route element={<RequireRole allowedRoles={['STAFF']} />}>
          <Route path="/staffs/receptions" element={<StaffReceptionList />} />
          <Route path="/staffs/notifications" element={<StaffNotifications />} />
          <Route path="/staffs/payment" element={<StaffPayment />} />
          <Route path="/staffs/receipt-list" element={<StaffReceiptList />} />
          <Route path="/staffs/receipt-list/:id" element={<StaffReceiptDetail />} />
          <Route path="/staffs/advance-payments" element={<StaffAdvancePayments />} />
        </Route>
        <Route element={<RequireRole allowedRoles={['TECH']} />}>
          {/* <Route path="/techs/home" element={<TechHome />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
