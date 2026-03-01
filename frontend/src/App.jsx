import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './dashboard/Dashboard';
import LandingPage from './landing/LandingPage';
import ProtectedRoute from './auth/ProtectedRoute';
import SyncUserToBackend from './auth/syncUserToBackend';
import AppTheme from './shared-theme/AppTheme';

export default function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <SyncUserToBackend />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppTheme>
  );
}
