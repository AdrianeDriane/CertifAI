<<<<<<< HEAD
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/user/pages/Home';
import LoginSuccess from './features/auth/pages/LoginSuccess';
import { PrivateRoute } from './components/auth/PrivateRoute';
import DocumentLayout from './layouts/DocumentLayout';
=======
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Home from "./features/user/pages/Home";
import LoginSuccess from "./features/auth/pages/LoginSuccess";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import DocEditor from "./features/documentEditor/DocEditor";
import DocumentsPage from "./features/documentEditor/DocumentsPage";
>>>>>>> b179dc0f36a9337bcd6e8ad008c78e030e637cc7

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
<<<<<<< HEAD
        path="/document"
=======
        path="/documents"
        element={
          <PrivateRoute>
            <DocumentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/document-editor/:documentId"
>>>>>>> b179dc0f36a9337bcd6e8ad008c78e030e637cc7
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
