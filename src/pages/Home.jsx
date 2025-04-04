import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container } from '../components';
import sqlProblems from '../data/sqlProblems';
import { getAllProblems } from '../api/problem';
import { useNotification } from '../utils/hooks';

export default function Home() {
  const [problems, setProblems] = useState(sqlProblems);
  const navigate = useNavigate();
  const { updateNotification } = useNotification();

  useEffect(() => {
    const fetchProblems = async () => {
      // todo
      const { data, error } = await getAllProblems()
      if (error) return updateNotification('error', JSON.stringify(error));
      setProblems([...data])
    };

    fetchProblems();
  }, [updateNotification]);

  return (
    <>
      <Navbar selected={0} />
      <Container>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th>Title</th>
              <th>Topic</th>
              <th>Acceptance</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(
              ({ problem_id, title, topic, difficulty_level, acceptance }, index) => (
                <tr
                  key={problem_id}
                  className={
                    (index % 2 === 0 ? 'bg-slate-100' : '') + ' cursor-pointer'
                  }
                  onClick={() => navigate(`/problems/${problem_id}`)}
                >
                  <td className="p-2 rounded">{problem_id}</td>
                  <td className="hover:text-blue-400 transition">{title}</td>
                  <td>{topic}</td>
                  <td>{Math.round(acceptance * 10) / 10 + '%'}</td>
                  <td
                    className={
                      difficulty_level === 'Easy'
                        ? 'text-green-500'
                        : difficulty_level === 'Medium'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }
                  >
                    {difficulty_level}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </Container>
    </>
  );
}
