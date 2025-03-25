import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container } from '../components';
import sqlProblems from '../data/sqlProblems';

export default function Home() {
  const [problems, setProblems] = useState(sqlProblems);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      // todo
    };

    fetchProblems();
  }, []);

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
              ({ id, title, topic_id, difficulty_level }, index) => (
                <tr
                  key={id}
                  className={
                    (index % 2 === 0 ? 'bg-slate-100' : '') + ' cursor-pointer'
                  }
                  onClick={() => navigate(`/problems/${id}`)}
                >
                  <td className="p-2 rounded">{id}</td>
                  <td className="hover:text-blue-400 transition">{title}</td>
                  <td>{topic_id}</td>
                  <td>100%</td>
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
