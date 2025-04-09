import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Loading,
  Navbar,
  Section,
  SQLEditor,
  TableSection,
} from '../components';
import { useAuth, useNotification } from '../utils/hooks';
import { marked } from 'marked';
import { markdownToPlainText } from '../utils/helpers';
import { getAllowedSchemas, submitSqlQuery } from '../api/analytics';

const headerStyles = 'text-2xl font-semibold';
const formatColumns = ['Column Name', 'Type'];

export default function Analytics() {
  const [schemas, setSchemas] = useState({});
  const [sqlQuery, setSqlQuery] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [questionResponse, setQuestionResponse] = useState(
    '```sql\nSELECT user_id FROM Attempt\nWHERE problem_id = 3;\n```'
  );
  const [queryResponse, setQueryResponse] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [queryPending, setQueryPending] = useState(false);
  const [questionPending, setQuestionPending] = useState(false);
  const { authInfo } = useAuth();
  const { profile, isLoggedIn } = authInfo;
  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      updateNotification('error', 'You are not logged in!');
      navigate('/login');
      return;
    }
    if (profile.role !== 'Instructor') {
      updateNotification('error', 'You are not authorized!');
      navigate('/');
    }
  }, [isLoggedIn, navigate, profile.role, updateNotification]);

  useEffect(() => {
    const fetchSchemas = async () => {
      const { data, error } = await getAllowedSchemas();
      setLoading(false);
      if (error) return updateNotification('error', JSON.stringify(error));
      setSchemas(data);
    };
    fetchSchemas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExecuteSqlQuery = async () => {
    setQueryPending(true);
    const { data, error } = await submitSqlQuery(sqlQuery);
    setQueryPending(false);
    if (error) return updateNotification('error', JSON.stringify(error));
    updateNotification('success', 'Your query is successfully executed!');
    setQueryResponse(data);
  };

  const handleSendQuestion = async () => {
    setQuestionPending(true);
    // TO DO
    setQuestionPending(false);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <Section className="w-1/3 ml-2 mr-1">
          <h1 className={headerStyles}>Allowed Columns</h1>
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-4">
              {Object.entries(schemas).map(([key, value]) => (
                <TableSection
                  key={key}
                  tableName={`Schema: ${key}`}
                  header={formatColumns}
                  rows={value?.map(({ name, type }) => [name, type])}
                />
              ))}
            </div>
          )}
        </Section>

        <Section className="w-1/3 ml-1 mr-1">
          <h1 className={headerStyles}>Format Your Query</h1>
          <div className="flex flex-col gap-3 mb-3">
            <SQLEditor value={sqlQuery} onValueChange={code => setSqlQuery(code)} />
            <Button
              disabled={queryPending || !sqlQuery.trim()}
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleExecuteSqlQuery}
              pending={queryPending}
              text="Execute"
            />
          </div>

          <div className="flex flex-col gap-3">
            <p>Or generate query from AI:</p>
            {questionResponse && (
              <div className="relative w-full px-4 py-2 bg-gray-50 rounded-md border border-gray-300">
                <button
                  className="absolute top-2 right-2 text-sm text-blue-600 hover:underline"
                  onClick={() =>
                    setSqlQuery(markdownToPlainText(questionResponse))
                  }
                >
                  Copy
                </button>
                <div
                  dangerouslySetInnerHTML={{ __html: marked(questionResponse) }}
                />
              </div>
            )}
            <textarea
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              rows={2}
              className="w-full h-16 border rounded px-2 py-1"
              placeholder="Type your question..."
              onKeyDown={handleSendQuestion}
            />
            <Button
              disabled={questionPending || !questionInput.trim()}
              className="bg-green-500 hover:bg-green-600"
              onClick={handleSendQuestion}
              pending={questionPending}
              text="Send"
            />
          </div>
        </Section>

        <Section className="w-1/3 ml-1 mr-2">
          <h1 className={headerStyles}>Query Output</h1>
          <TableSection
            tableName="Output Table"
            header={queryResponse.columns}
            rows={queryResponse.rows}
          />
        </Section>
      </div>
    </div>
  );
}
