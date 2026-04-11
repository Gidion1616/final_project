import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import JobApplicationForm from "./pages/JobApplication";
import Complaint from "./pages/Complaint";
import UploadProfile from "./pages/UploadProfile";
import MyApplications from "./pages/MyApplications";
import JobList from "./pages/JobList";
import UserDashboard from "./pages/UserDashboard";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ViewComplaints from "./pages/ViewComplaints";
import ManageJobs from "./pages/ManageJobs";
import AdminProfile from "./pages/AdminProfile";

import HotelRegistration from "./pages/HotelRegistration";
import HotelDashboard from "./pages/HotelDashboard";
import PostJob from "./pages/hotel/PostJob";
import ViewApplications from "./pages/hotel/ViewApplications";
import HotelLogin from "./pages/HotelLogin";
import UserTypeSelection from "./pages/UserTypeSelection";
import EthicsAndTraining from "./pages/EthicsAndTraining";

function App() {
  const location = useLocation();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const adminToken = localStorage.getItem("adminToken");
  const hotelLoggedIn = localStorage.getItem("hotelLoggedIn") === "true";

  // Hide Navbar/Footer on specific paths
  const hideLayoutPaths = ["/admin/login", "/admin/dashboard", "/hotel-login", "/hotel-dashboard"];
  const hideLayout = hideLayoutPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideLayout && <Navbar />}
      {isLoading && <div className="loading-spinner">Loading...</div>}
      {apiError && (
        <div className="error-message">
          {apiError}
          <button onClick={() => setApiError(null)}>Dismiss</button>
        </div>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/select-user" element={<UserTypeSelection />} />
        <Route path="/apply/:jobId" element={<JobApplicationForm />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/hotel-login" element={<HotelLogin />} />
        <Route path="/hotel/register" element={<HotelRegistration />} />
        <Route path="/jobseeker/register" element={<Register />} />
        <Route path="/jobseeker/login" element={<Login />} />
        <Route path="/ethics-training" element={<EthicsAndTraining />} />
        <Route path="/jobseeker/my-applications" element={<MyApplications />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            localStorage.getItem("token") ? (
              <UserDashboard />
            ) : (
              <Navigate to="/jobseeker/login" replace />
            )
          }
        />
        <Route
          path="/upload-profile"
          element={
            <ProtectedRoute>
              <UploadProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            adminToken ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route
          path="/admin/view-complaints"
          element={
            adminToken ? <ViewComplaints /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route
          path="/admin/manage-jobs"
          element={
            adminToken ? <ManageJobs /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route
          path="/admin/profile"
          element={
            adminToken ? <AdminProfile /> : <Navigate to="/admin/login" replace />
          }
        />

        {/* Hotel Routes - Protected by login */}
        <Route
          path="/hotel-dashboard"
          element={
            hotelLoggedIn ? <HotelDashboard /> : <Navigate to="/hotel-login" replace />
          }
        />
        <Route
          path="/hotel-dashboard/post-job"
          element={
            hotelLoggedIn ? <PostJob /> : <Navigate to="/hotel-login" replace />
          }
        />
        <Route
          path="/hotel-dashboard/view-applications"
          element={
            hotelLoggedIn ? <ViewApplications /> : <Navigate to="/hotel-login" replace />
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
