import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContainer } from '../components';
import { useAuth, useNotification } from '../utils/hooks';
import { isValidEmail } from '../utils/helpers';
import { createUser } from '../api/auth';

const inputStyle = 'w-96 px-3 py-1 outline outline-1 outline-gray-300 rounded';

const validateUser = (name, email, password, confirmedPassword) => {
  const nameRegex = /^[a-z A-Z]+$/;
  if (!name.trim()) return { ok: false, error: 'Name is missing!' };
  if (!nameRegex.test(name)) return { ok: false, error: 'Invalid name!' };
  if (!email.trim()) return { ok: false, error: 'Email is missing!' };
  if (!isValidEmail(email)) return { ok: false, error: 'Invalid email!' };
  if (!password.trim()) return { ok: false, error: 'Password is missing!' };
  if (password.length < 8)
    return { ok: false, error: 'Password must be at least 8 characters!' };
  if (password !== confirmedPassword)
    return { ok: false, error: "Passwords don't match!" };
  return { ok: true };
};

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const navigate = useNavigate();
  const { updateNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // todo
    const { ok, error } = validateUser(
      username,
      email,
      password,
      confirmedPassword
    );
    if (!ok) return updateNotification('error', error);
    const { error: err, user } = await createUser(
      username,
      email,
      password,
      confirmedPassword
    );
    if (err) return updateNotification('error', err);
    navigate('/', { state: { user }, replace: true });
  };

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <input
        className={inputStyle}
        type="text"
        placeholder="Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className={inputStyle}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={inputStyle}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className={inputStyle}
        type="password"
        placeholder="Confirm Password"
        value={confirmedPassword}
        onChange={(e) => setConfirmedPassword(e.target.value)}
      />
      <button
        type="submit"
        className="text-white bg-slate-600 hover:bg-slate-500 transition rounded w-full py-1"
      >
        Sign Up
      </button>
      <div className="flex w-full justify-center items-center gap-1 text-sm">
        <span className="text-slate-400">Have an account?</span>
        <Link to="/login">
          <button className="text-slate-600 hover:text-slate-800 transition">
            Sign In
          </button>
        </Link>
      </div>
    </FormContainer>
  );
}
