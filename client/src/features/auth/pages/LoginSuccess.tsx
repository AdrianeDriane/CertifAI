import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);

      // FIXME: find better ways
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 100); // Small delay to ensure localStorage is updated
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, setToken]);

  return <div>Redirecting...</div>;
};

export default LoginSuccess;
