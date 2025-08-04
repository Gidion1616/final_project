import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import JobApplication from "./pages/JobApplication";
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

function App() {
  const location = useLocation();

  const isLoggedIn = localStorage.getItem("token") !== null;
  const isProfileComplete = localStorage.getItem("isProfileComplete") === "true";
  const isAdminLoggedIn = localStorage.getItem("adminToken") !== null;
  const isHotelLoggedIn = localStorage.getItem("hotelRegistered") === "true";

  const hideLayoutPaths = ["/admin/login", "/admin/dashboard", "/hotel-dashboard"];
  const hideLayout = hideLayoutPaths.some((path) => location.pathname.startsWith(path));

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply/:id" element={<JobApplication />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/upload-profile" element={<UploadProfile />} />
        <Route path="/jobs" element={<JobList />} />


        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              isProfileComplete ? <UserDashboard /> : <Navigate to="/upload-profile" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route
          path="/admin/view-complaints"
          element={
            isAdminLoggedIn ? <ViewComplaints /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route
          path="/admin/manage-jobs"
          element={
            isAdminLoggedIn ? <ManageJobs /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route
          path="/admin/profile"
          element={
            isAdminLoggedIn ? <AdminProfile /> : <Navigate to="/admin/login" replace />
          }
        />

        {/* Hotel Routes */}
        <Route path="/hotel-register" element={<HotelRegistration />} />
        <Route
          path="/hotel-dashboard"
          element={
            isHotelLoggedIn ? <HotelDashboard /> : <Navigate to="/hotel-register" />
          }
        />
        <Route
          path="/hotel-dashboard/post-job"
          element={
            isHotelLoggedIn ? <PostJob /> : <Navigate to="/hotel-register" />
          }
        />
        <Route
          path="/hotel-dashboard/view-applications"
          element={
            isHotelLoggedIn ? <ViewApplications /> : <Navigate to="/hotel-register" />
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
