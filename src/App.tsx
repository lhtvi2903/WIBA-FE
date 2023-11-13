import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Rooms/Home';
// import BookingFormPage from './components/Booking/BookingFormPage';
import './App.css'
import LayoutApp from './components/Layout/LayoutApp';
import CreateRoom from './components/Rooms/CreateRoom';
import FormLogin from './components/Form/Form';
import ProtectedRoute from './route/ProtectedRoute';
import PrivateRoute from './route/PrivateRoute';
import EmployeesManager from './components/Employees/EmployeesManager';
import BookingManager from './components/Booking/BookingManager';

const App: React.FC = () => {
  return (
    <div className="App" style={{width:1400, margin:'auto auto auto'}}>
        <Routes>
          <Route path="/login" element={<FormLogin />} />
          <Route path="/" element={<LayoutApp />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<BookingManager />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/add" element={<CreateRoom />} />
              <Route path="/employeesmanager" element={<EmployeesManager />} />
              <Route path="/bookingmanagement" element={<BookingManager />} />
            </Route>
          </Route>
        </Routes>
    </div>
  );
};

export default App;
