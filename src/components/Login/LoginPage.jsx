import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to company login by default
    navigate('/company/login', { replace: true });
  }, [navigate]);

  return null; // This component just redirects
};

export default LoginPage;