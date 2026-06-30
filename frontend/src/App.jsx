import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetUsername from "./pages/SetUsername";
import GenreSelection from "./pages/GenreSelection";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MatchResult from "./pages/MatchResults";
import OrganizerAttendees from "./pages/OrganizerAttendees";
import ComplaintForm from "./pages/ComplaintForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/set-username" element={<SetUsername />} />

        {/* Routes */}
        <Route
          path="/genres"
          element={
            <ProtectedRoute>
              <Layout>
                <GenreSelection />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Layout>
                <Events />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Layout>
                <MatchResult />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/attendees"
          element={
            <ProtectedRoute>
              <Layout>
                <OrganizerAttendees />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/new"
          element={
            <ProtectedRoute>
              <Layout>
                <ComplaintForm />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
