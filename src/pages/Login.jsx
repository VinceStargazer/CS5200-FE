import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContainer } from '../components';
import { useAuth } from '../utils/hooks';

const inputStyle = 'w-96 px-3 py-1 outline outline-1 outline-gray-300 rounded';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authInfo, handleLogin } = useAuth();
  const { isLoggedIn } = authInfo;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // todo
    await handleLogin(email, password);
  };

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  return (
    <FormContainer onSubmit={handleSubmit}>
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
      <button
        type="submit"
        className="text-white bg-slate-600 hover:bg-slate-500 transition rounded w-full py-1"
      >
        Sign In
      </button>
      <div className="flex w-full justify-center items-center gap-1 text-sm">
        <span className="text-slate-400">Don't have an account?</span>
        <Link to="/signup">
          <button className="text-slate-600 hover:text-slate-800 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </FormContainer>
  );
}
