import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/user/pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* User Side */}
      <Route path="/home" element={<Home />} />

    </Routes>
  );
}

export default App;
