import { useEffect } from 'react';
import { Container, Navbar } from '../components';
import notifications from '../data/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/hooks';
import { trim } from '../utils/helpers';

export default function Inbox() {
  const { authInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authInfo.isLoggedIn) navigate('/login');
  }, [authInfo.isLoggedIn, navigate]);

  return (
    <>
      <Navbar selected={2} />
      <Container>
        {notifications
          .toSorted((a, b) => b.timestamp.localeCompare(a.timestamp))
          .map(({ id, content, is_read, timestamp }, index) => (
            <div
              key={id}
              className={
                'flex p-2 justify-between items-center ' +
                (index % 2 === 0 ? 'bg-slate-100' : '')
              }
            >
              <span className={!is_read ? 'font-semibold' : ''}>
                {trim(content)}
              </span>
              <span>{timestamp}</span>
            </div>
          ))}
      </Container>
    </>
  );
}
