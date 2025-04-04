import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Loading,
  Navbar,
  CommentsSection,
  HintDialog,
  DescriptionSection,
  TabBar,
  AttemptsSection,
} from '../components';
import { getSingleProblem } from '../api/problem';
import { useNotification } from '../utils/hooks';
import { debounce } from 'lodash';
import { IoBulbOutline } from 'react-icons/io5';
import { generatePromptFromProblem } from '../utils/helpers';

const tabs = ['Description', 'Comments', 'Attempts'];

export default function Problem() {
  const { problemId } = useParams();
  const [ready, setReady] = useState(false);
  const [problem, setProblem] = useState({});
  const [solution, setSolution] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hintStep, setHintStep] = useState(0);
  const [hintResponses, setHintResponses] = useState([]);
  const [questionResponses, setQuestionResponses] = useState([]);

  const navigate = useNavigate();
  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    setSolution(target.value);
    debouncedSave(target.value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((newSolution) => {
      localStorage.setItem('p' + problemId, newSolution);
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

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      <Navbar
        isProblem={true}
        problemId={problemId}
        solution={solution}
        hintsStep={hintStep}
      />
      <div className="flex flex-grow">
        <Section className="ml-2 mr-1">
          {!ready ? (
            <Loading />
          ) : (
            <>
              <TabBar
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {activeTab === 0 && <DescriptionSection problem={problem} />}
              {activeTab === 1 && <CommentsSection problemId={problemId} />}
              {activeTab === 2 && <AttemptsSection problemId={problemId} />}
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
          <button
            onClick={() => setShowDialog(true)}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
          >
            <IoBulbOutline className="text-2xl" />
          </button>
        </Section>
      </div>
      {showDialog && (
        <HintDialog
          prompt={generatePromptFromProblem(problem, hintResponses, hintStep)}
          hintStep={hintStep}
          setHintStep={setHintStep}
          onClose={() => setShowDialog(false)}
          hintResponses={hintResponses}
          setHintResponses={setHintResponses}
          questionResponses={questionResponses}
          setQuestionResponses={setQuestionResponses}
        />
      )}
    </div>
  );
}

const Section = ({ children, className }) => {
  return (
    <div
      className={
        className +
        ' w-1/2 flex flex-col gap-4 my-2 p-5 rounded bg-white overflow-y-auto h-[calc(100vh-4rem)]'
      }
    >
      {children}
    </div>
  );
};
