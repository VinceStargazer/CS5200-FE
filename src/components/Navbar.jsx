import { useRef, useState } from 'react';
import { FaRegCircleUser } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import {
  IoTimerOutline,
  IoPauseCircleOutline,
  IoPlayCircleOutline,
} from 'react-icons/io5';
import { FaSpinner } from 'react-icons/fa6';
import { useAuth } from '../utils/hooks';

const buttonSelected = 'text-white font-semibold';
const buttonUnselected = 'text-slate-200 hover:text-white transition';

export default function Navbar({ isProblem, solution, selected = -1 }) {
  const [timerOn, setTimerOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const intervalId = useRef(null);
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const handleStartTimer = () => {
    setTimerOn(true);
    intervalId.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
  };

  const handlePauseTimer = () => {
    clearInterval(intervalId.current);
    setPaused(true);
  };

  const handleContinueTimer = () => {
    setPaused(false);
    intervalId.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePauseTimer();
    setSubmitLoading(true);
    setTimeout(() => {
      console.log(solution);
      setSubmitLoading(false);
    }, 1000);
  };

  const hours = Math.floor(timeElapsed / 3600);
  const minutes = Math.floor((timeElapsed % 3600) / 60);
  const seconds = timeElapsed % 60;

  return (
    <form className="bg-blue-500" onSubmit={handleSubmit}>
      <div className="flex justify-between px-4 py-2">
        <div className="flex items-center space-x-10">
          <Link to="/">
            <button
              type="button"
              className={selected === 0 ? buttonSelected : buttonUnselected}
            >
              Problems
            </button>
          </Link>
          <Link to={isLoggedIn ? '/inbox' : '/login'}>
            <button
              type="button"
              className={selected === 1 ? buttonSelected : buttonUnselected}
            >
              Inbox
            </button>
          </Link>
        </div>
        {isProblem && (
          <div className="flex items-center space-x-10 text-slate-200">
            {!timerOn ? (
              <NavbarButton type="button" onClick={handleStartTimer}>
                <IoTimerOutline title="Start timer" size={24} />
              </NavbarButton>
            ) : !paused ? (
              <NavbarButton type="button" onClick={handlePauseTimer}>
                <IoPauseCircleOutline title="Pause" size={24} />
              </NavbarButton>
            ) : (
              <NavbarButton type="button" onClick={handleContinueTimer}>
                <IoPlayCircleOutline title="Continue" size={24} />
              </NavbarButton>
            )}
            <span>{`${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
              <div className='w-40'>
                {submitLoading ? (
              <FaSpinner className="animate-spin" size={24} />
            ) : (
              <NavbarButton type="submit">Submit</NavbarButton>
            )}
              </div>
            
          </div>
        )}
        <Link to={isLoggedIn ? '/user' : '/login'}>
          <button
            type="button"
            className={selected === 2 ? buttonSelected : buttonUnselected}
          >
            <FaRegCircleUser size={24} />
          </button>
        </Link>
      </div>
    </form>
  );
}

const NavbarButton = ({ children, type, onClick }) => {
  return (
    <button
      type={type}
      className="text-white rounded px-3 bg-blue-400 hover:text-green-200 transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
