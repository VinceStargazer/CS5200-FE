import { useEffect, useState } from 'react';
import { Container, Navbar } from '../components';
import { useAuth } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';

const buttonStyles = 'w-64 text-white px-3 py-1 rounded transition';

export default function User() {
  const { authInfo, handleLogout } = useAuth();
  const { profile, isLoggedIn } = authInfo;
  const [newProfile, setNewProfile] = useState({ ...profile });
  const navigate = useNavigate();

  const handleProfileChange = (e) => {
    e.preventDefault();
  };

  const handleUserLogout = async () => {
    await handleLogout();
    navigate('/');
  };

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  const { name, email, password, profile_info } = newProfile;

  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar selected={2} />
      <div className="flex justify-center">
        <form
          className="flex flex-col gap-5 p-10 justify-center items-center"
          onSubmit={handleProfileChange}
        >
          <FormEntry
            label="Name"
            value={name}
            onChange={(e) =>
              setNewProfile({ ...newProfile, name: e.target.value })
            }
          />
          <FormEntry
            label="Email"
            value={email}
            onChange={(e) =>
              setNewProfile({ ...newProfile, email: e.target.value })
            }
          />
          <FormEntry
            label="Password"
            value={password}
            type="password"
            onChange={(e) =>
              setNewProfile({ ...newProfile, password: e.target.value })
            }
          />
          <FormEntry
            label="About Me"
            isTextarea
            value={profile_info}
            onChange={(e) =>
              setNewProfile({ ...newProfile, profile_info: e.target.value })
            }
          />

          <button
            type="submit"
            className={
              buttonStyles +
              ' bg-green-500  disabled:bg-green-300 hover:bg-green-600'
            }
            disabled={JSON.stringify(profile) === JSON.stringify(newProfile)}
          >
            Submit Change
          </button>
          <button
            type="button"
            className={buttonStyles + ' bg-red-500 hover:bg-red-600'}
            onClick={handleUserLogout}
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}

const FormEntry = ({ label, value, onChange, type = 'text', isTextarea }) => {
  const commonStyles =
    'w-96 outline outline-1 outline-gray-300 px-2 py-1 rounded';
  return (
    <div className="flex gap-2 items-center text-slate-800">
      <label className="w-20" htmlFor={label}>
        {label}
      </label>
      {!isTextarea ? (
        <input
          id={label}
          className={commonStyles}
          type={type}
          value={value}
          onChange={onChange}
        />
      ) : (
        <textarea
          id={label}
          className={commonStyles + ' h-24'}
          type={type}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};
