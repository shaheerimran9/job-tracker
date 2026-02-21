import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import JobDetailPage from "./pages/JobDetailPage";
import JobFormPage from "./pages/JobFormPage";
import CreateJobPage from "./pages/CreateJobPage";

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path='/jobs/:id' element={
        <ProtectedRoute>
          <JobDetailPage />
        </ProtectedRoute>
      } />
      <Route path='/jobs/create' element={
        <ProtectedRoute>
          <CreateJobPage />
        </ProtectedRoute>
      } />
      <Route path='/jobs/:id/edit' element={
        <ProtectedRoute>
          <JobFormPage />
        </ProtectedRoute>
      } />
      <Route path='/' element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}

export default App;