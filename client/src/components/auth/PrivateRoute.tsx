import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../services/authService";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { TrophySpin } from "react-loading-indicators";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await api.get("/auth/validate");
        setIsAuthenticated(true);
      } catch (err) {
        const error = err as AxiosError;

        if (error.response?.status === 403) {
          // Email verification logic
          const token = localStorage.getItem("token");
          let email: string | undefined;
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              email = payload.email;
              //TODO: Logged for now but should handle this properly, can be used for email verification feature
              console.log(email);
            } catch {
              console.error("Failed to decode token");
            }
          }
          navigate("/home", { replace: true });
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    validate();
  }, [navigate]);

  if (isLoading)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <TrophySpin color="#aa6bfe" size="small" />
      </div>
    );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
