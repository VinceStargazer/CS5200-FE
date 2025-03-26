import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContainer } from '../components';
import { useAuth } from '../utils/hooks';

const inputStyle = 'w-96 px-3 py-1 outline outline-1 outline-gray-300 rounded';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // todo
  };

  // useEffect(() => {
  //   if (isLoggedIn) navigate('/');
  // }, [isLoggedIn, navigate]);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <input
        className={inputStyle}
        type="text"
        placeholder="Username"
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
