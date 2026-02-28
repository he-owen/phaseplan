import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './dashboard/Dashboard';
import CrudDashboard from './crud-dashboard/CrudDashboard';
import SignIn from './sign-in/SignIn';
import SignInSide from './sign-in-side/SignInSide';
import SignUp from './sign-up/SignUp';

export default function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crud/*" element={<CrudDashboard />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-in-side" element={<SignInSide />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </>
  );
}
