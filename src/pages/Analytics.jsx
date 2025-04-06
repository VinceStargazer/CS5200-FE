import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar } from '../components';
import { useAuth, useNotification } from '../utils/hooks';

export default function Analytics() {
  const { authInfo } = useAuth();
  const { profile, isLoggedIn } = authInfo;
  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      updateNotification('error', 'You are not logged in!');
      navigate('/login');
      return;
    }
    if (profile.role !== 'Instructor') {
      updateNotification('error', 'You are not authorized!');
      navigate('/');
    }
  }, [isLoggedIn, navigate, profile.role, updateNotification]);

  return (
    <>
      <Navbar />
      <Container>TODO: Student Analytics</Container>
    </>
  );
}
