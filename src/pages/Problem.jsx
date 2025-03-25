import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import sqlProblems from '../data/sqlProblems';
import { Navbar } from '../components';
import { IoBulbOutline } from 'react-icons/io5';

export default function Problem() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState({});
  const [solution, setSolution] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = sqlProblems.filter(({ id }) => id === parseInt(problemId));
    if (!filtered.length) {
      navigate('/');
      return;
    }
    setProblem(filtered[0]);
  }, [navigate, problemId]);

  const { title, description, difficulty_level } = problem;

  return (
    <div className="h-screen bg-slate-200 flex flex-col">
      <Navbar isProblem={true} solution={solution} />
      <div className="flex flex-grow">
        <Section className="ml-2 mr-1">
          <h1 className="text-2xl font-semibold">{problemId + '. ' + title}</h1>
          <label
            className={
              (difficulty_level === 'Easy'
                ? 'text-green-500'
                : difficulty_level === 'Medium'
                ? 'text-yellow-500'
                : 'text-red-500') +
              ' text-xs w-fit bg-slate-100 px-2 py-1 rounded-full'
            }
          >
            {difficulty_level}
          </label>
          <p>{description}</p>
          <button className="w-fit text-sm flex items-center gap-1 px-2 rounded bg-slate-100 hover:text-green-600 transition">
            <IoBulbOutline />
            Ask for hint
          </button>
        </Section>
        <Section className="ml-1 mr-2">
          <textarea
            className="flex-1 focus:outline-none"
            placeholder="Type something..."
            onChange={({ target }) => setSolution(target.value)}
            value={solution}
          />
        </Section>
      </div>
    </div>
  );
}

const Section = ({ children, className }) => {
  return (
    <div
      className={
        className + ' w-1/2 flex flex-col gap-4 my-2 p-5 rounded bg-white'
      }
    >
      {children}
    </div>
  );
};
