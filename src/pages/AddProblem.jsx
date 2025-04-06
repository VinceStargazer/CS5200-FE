import { useState } from 'react';
import AddProblemForm from './AddProblemForm';
// import { useAuth } from '../context/AuthContext';

export default function AddProblem() {
  // const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // if (user?.role !== 'instructor') return null;

  return (
      <div className="mb-6">
        <button
            onClick={() => setOpen((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          {open ? '− Hide Add Problem' : '+ Add a New Problem'}
        </button>

        {open && <AddProblemForm />}
      </div>
  );
}
