import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/user/pages/Home';
import LoginSuccess from './features/auth/pages/LoginSuccess';
import { PrivateRoute } from './components/auth/PrivateRoute';
import DocumentLayout from './layouts/DocumentLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (User Side) */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      
        {/* Document Layout with nested routes */}
      <Route
        path="/document"
        element={
          <PrivateRoute>
            <DocumentLayout />
          </PrivateRoute>
        }

      />

      {/* User Side */}
      <Route path="/login/success" element={<LoginSuccess />} />
    </Routes>
  );
}

export default App;
