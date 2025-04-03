import { useCallback, useEffect, useState, useRef} from 'react';
import {
  useNavigate,
  useParams
} from 'react-router-dom';
import { Loading, Navbar, CommentsSection, HintDialog } from '../components';
import { IoBulbOutline } from 'react-icons/io5';
import { getSingleProblem } from '../api/problem';
import { useNotification } from '../utils/hooks';
import { debounce } from 'lodash';

const labelStyles = ' text-xs w-fit bg-slate-100 px-2 py-1 rounded-full';
const tdStyles = 'text-sm border border-dashed border-slate-300 px-2 py-1';

export default function Problem() {
  const { problemId } = useParams();
  const [ready, setReady] = useState(false);
  const [problem, setProblem] = useState({});
  const [solution, setSolution] = useState('');
  const navigate = useNavigate();
  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    setSolution(target.value);
    debouncedSave(target.value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((newSolution) => {
      localStorage.setItem("p" + problemId, newSolution);
    }, 500),
    [problemId]
  );

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  useEffect(() => {
    const prevSolution = localStorage.getItem('p' + problemId);
    if (prevSolution) setSolution(prevSolution);
  }, [problemId]);
  const [showDialog, setShowDialog] = useState(false);
  const [promptText, setPromptText] = useState('');
  const descriptionRef = useRef();

  useEffect(() => {
    const fetchCurrentProblem = async () => {
      const { data, error } = await getSingleProblem(problemId);
      if (error) {
        updateNotification('error', JSON.stringify(error));
        navigate('/');
      }
      setReady(true);
      setProblem({ ...data });
    };
    fetchCurrentProblem();
  }, [navigate, problemId, updateNotification]);

  const { title, description, difficulty_level, topic, tables } = problem;
  const handleAskHint = () => {
    const text = descriptionRef.current?.innerText || '';
    setPromptText(text);
    setShowDialog(true);
  };

  return (
    <div className="h-screen bg-slate-200 flex flex-col">
      <Navbar
        isProblem={true}
        problemId={problemId}
        solution={solution}
      />
      <div className="flex flex-grow">
        <Section className="ml-2 mr-1">
          {!ready ? (
            <Loading />
          ) : (
            <>
              <h1 className="text-2xl font-semibold">
                {problemId + '. ' + title}
              </h1>
              <div className="flex gap-3">
                <label
                  title="difficulty level"
                  className={
                    (difficulty_level === 'Easy'
                      ? 'text-green-500'
                      : difficulty_level === 'Medium'
                      ? 'text-yellow-500'
                      : 'text-red-500') + labelStyles
                  }
                >
                  {difficulty_level}
                </label>
                <label title="topic" className={'text-slate-800' + labelStyles}>
                  {topic}
                </label>
              </div>
              <p>{description}</p>
              {tables.map((table) => (
                <TableSection table={table} />
              ))}
              <button
                className="w-fit text-sm flex items-center gap-1 px-2 rounded bg-slate-100 hover:text-green-600 transition"
                onClick={handleAskHint}
              >
                <IoBulbOutline />
                Ask for hint
              </button>
              <CommentsSection problemId={problemId} />
            </>
          )}
        </Section>

      <Section className="ml-1 mr-2">
          <textarea
            className="flex-1 focus:outline-none"
            placeholder="Type something..."
            onChange={handleChange}
            value={solution}
          />
        </Section>
      </div>
      {showDialog && (
          <HintDialog
              prompt={promptText}
              onClose={() => setShowDialog(false)}
          />
      )}
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
}

const TableSection = ({ table }) => {
  const { table_name, columns } = table;
  return (
    <div className="flex flex-col gap-2" key={table_name}>
      <div className="flex gap-2">
        <span>Table:</span>
        <span className="font-semibold">{table_name}</span>
      </div>
      <table className="text-left">
        <tr>
          <th className={tdStyles}>Column Name</th>
          <th className={tdStyles}>Type</th>
          <th className={tdStyles}>Description</th>
        </tr>
        {columns.map(({ name, type, description }) => (
          <tr key={name}>
            <td className={tdStyles}>{name}</td>
            <td className={tdStyles}>{type}</td>
            <td className={tdStyles}>{description}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};
