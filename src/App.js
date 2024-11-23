// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import WelcomePage from './pages/WelcomePage';
import UserPage from './pages/UserPage';
import Reservations from './pages/Reservations';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AdminProfile from './pages/AdminProfile';
import Sales from './pages/Sales';
import EmployeeSelect from './pages/EmployeeSelectionPage';
import FinalReservation from './pages/FinalReservation';
import CreateAdmin from './pages/CreateAdmin';
import ManageUsersEmployee from './pages/ManageUsersEmployees';
import AdminTodayReservations from './pages/AdminTodayReservations';
import ManageServices from './pages/ManageServices';
import Homepage from './pages/Homepage';
import Billing from './pages/Billing';
import FinalizeBillingPage from './pages/FinalizeBilling'
import NotFound from './pages/Notfound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/adminsales" element={<Sales />} />
        <Route path="/adminprofile" element={<AdminProfile />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/employee-selection" element={<EmployeeSelect />} />
        <Route path="/final-reservation" element={<FinalReservation />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
        <Route path="/manage-user-employee" element={<ManageUsersEmployee />} />
        <Route path="/admin-today-reservations" element={<AdminTodayReservations />} />
        <Route path="/manage-service" element={<ManageServices />} />
        <Route path='/billing' element={<Billing/>}/>
        <Route path='/finalize-billing' element={<FinalizeBillingPage/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
