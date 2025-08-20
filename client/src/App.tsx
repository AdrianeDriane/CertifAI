import { Routes, Route } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Home from "./features/user/pages/Home";
import LoginSuccess from "./features/auth/pages/LoginSuccess";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import DocumentLayout from "./layouts/DocumentLayout";
import DocumentsPage from "./features/documentEditor/DocumentsPage";
import { LandingPage } from "./features/landing/pages/LandingPage";
import Error403Page from "./features/errors/pages/Error403Page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/403" element={<Error403Page />} />

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
        path="/documents"
        element={
          <PrivateRoute>
            <DocumentsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/document-editor/:documentId"
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
