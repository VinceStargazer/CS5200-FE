import { useEffect } from 'react';
import { Container, Navbar } from '../components';
import { useAuth } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';

export default function User() {
  const { authInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authInfo.isLoggedIn) navigate('/login');
  }, [authInfo.isLoggedIn, navigate]);

  return (
    <>
      <Navbar selected={2} />
      <Container>
        
      </Container>
    </>
  );
}
