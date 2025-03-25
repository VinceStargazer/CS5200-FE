import { useEffect } from 'react';
import { Container, Navbar } from '../components';
import notifications from '../data/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/hooks';

export default function Inbox() {
  const { authInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authInfo.isLoggedIn) navigate('/login');
  }, [authInfo.isLoggedIn, navigate]);

  return (
    <>
      <Navbar selected={1} />
      <Container>
        {notifications.map(({ id, content, is_read, timestamp }) => (
          <div key={id} className="flex">
            <p className="">{content}</p>
          </div>
        ))}
      </Container>
    </>
  );
}
