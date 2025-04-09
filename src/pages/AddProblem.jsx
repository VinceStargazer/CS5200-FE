import React, { useEffect, useState } from 'react';
import { useAuth, useNotification } from '../utils/hooks';
import { Container, Navbar } from '../components';
import { FaSpinner } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { uploadProblem } from '../api/problem';

const labelStyles = 'block font-medium mb-1';
const inputStyles = 'border p-2 w-full';

export default function AddProblem() {
  const [files, setFiles] = useState({
    metadata: null,
    problem: null,
    solution: null,
  });
  const [pending, setPending] = useState(false);
  const [fillingMode, setFillingMode] = useState('file');
  const [form, setForm] = useState({
    title: '',
    topic_id: null,
    description: '',
    difficulty_level: 'Easy',
    requires_order: true,
    tables: '',
    input_data: '',
    expected_output: '',
  });
  const [problemSql, setProblemSql] = useState('');
  const [solutionSql, setSolutionSql] = useState('');

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

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles({ ...files, [key]: file });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;
    try {
      if (name === 'topic_id') {
        parsedValue = parseInt(value);
      }
    } catch (err) {
      parsedValue = value;
    }

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;
    const formData = new FormData();
    if (fillingMode === 'file') {
      const { metadata, problem, solution } = files;
      if (!metadata || !problem || !solution) {
        updateNotification('error', 'Please upload all 3 required files.');
        return;
      }
      formData.append('metadata_file', metadata);
      formData.append('problem_file', problem);
      formData.append('solution_file', solution);
    } else {
      try {
        parseInt(form.topic_id);
        JSON.parse(form.tables);
        JSON.parse(form.input_data);
        JSON.parse(form.expected_output);
        const metadataBlob = new Blob([JSON.stringify(form)], {
          type: 'application/json',
        });
        const problemBlob = new Blob([problemSql], { type: 'application/sql' });
        const solutionBlob = new Blob([solutionSql], {
          type: 'application/sql',
        });
        formData.append('metadata_file', metadataBlob, 'metadata.json');
        formData.append('problem_file', problemBlob, 'problem.sql');
        formData.append('solution_file', solutionBlob, 'solution.sql');
      } catch (err) {
        updateNotification('error', 'Invalid data format. Please check again');
      }
    }

    setPending(true);
    const { error } = await uploadProblem(formData);
    if (error) {
      updateNotification('error', JSON.stringify(error));
    } else {
      updateNotification('success', 'Problem uploaded successfully!');
    }
    setFiles({ metadata: null, problem: null, solution: null });
    setPending(false);
  };

  return (
    <>
      <Navbar />
      <Container className="flex justify-center items-start min-h-screen pt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 border p-6 rounded w-full max-w-xl"
        >
          <h2 className="text-xl font-bold">Upload SQL Problem</h2>
          {fillingMode === 'file' && (
            <>
              <div>
                <label className={labelStyles}>Metadata (JSON)</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileChange(e, 'metadata')}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>Problem SQL</label>
                <input
                  type="file"
                  accept=".sql"
                  onChange={(e) => handleFileChange(e, 'problem')}
                  required
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>Solution SQL</label>
                <input
                  type="file"
                  accept=".sql"
                  onChange={(e) => handleFileChange(e, 'solution')}
                  required
                  className={inputStyles}
                />
              </div>
            </>
          )}

          {fillingMode === 'manual' && (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleFormChange}
                className={inputStyles}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleFormChange}
                className={inputStyles}
                rows={4}
                required
              />

              <input
                type="number"
                name="topic_id"
                placeholder="Topic ID"
                value={form.topic_id}
                onChange={handleFormChange}
                className={inputStyles}
                required
              />

              <select
                name="difficulty_level"
                value={form.difficulty_level}
                onChange={handleFormChange}
                className={inputStyles}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                name="requires_order"
                value={form.requires_order}
                onChange={handleFormChange}
                className={inputStyles}
              >
                <option value={true}>Order Required</option>
                <option value={false}>No order required</option>
              </select>

              <textarea
                name="tables"
                placeholder='Tables JSON (e.g. [{"table_name":"Users","columns":[{"name":"id","type":"int"}]}])'
                value={form.tables}
                onChange={handleFormChange}
                className={inputStyles}
                rows={4}
              />

              <textarea
                name="input_data"
                placeholder='Input Data JSON (e.g. {"Users":[["id","name"],[1,"Alice"]]})'
                value={form.input_data}
                onChange={handleFormChange}
                className={inputStyles}
                rows={4}
              />

              <textarea
                name="expected_output"
                placeholder='Expected Output JSON (e.g. [["id","name"],[1,"Alice"]])'
                value={form.expected_output}
                onChange={handleFormChange}
                className={inputStyles}
                rows={4}
              />

              <textarea
                name="problem_sql"
                placeholder="Problem SQL (i.e., SQL commands to set up the problem environment)"
                value={problemSql}
                onChange={(e) => setProblemSql(e.target.value)}
                className={inputStyles}
                rows={4}
              />

              <textarea
                name="solution_sql"
                placeholder="Solution SQL (i.e., The official SQL solution to this problem used for output comparison)"
                value={solutionSql}
                onChange={(e) => setSolutionSql(e.target.value)}
                className={inputStyles}
                rows={4}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
          >
            {pending ? <FaSpinner className="animate-spin mr-2" /> : null}
            {pending ? 'Uploading...' : 'Upload Problem'}
          </button>
          <button
            type="button"
            className="text-slate-500 text-sm underline hover:text-blue-500 transition"
            onClick={() =>
              setFillingMode(fillingMode === 'file' ? 'manual' : 'file')
            }
          >
            {fillingMode === 'file'
              ? 'Or fill out the form manually'
              : 'Or fill out the form by uploading files'}
          </button>
        </form>
      </Container>
    </>
  );
}
