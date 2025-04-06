import { Link } from 'react-router-dom';

export default function InstructorDashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <div className="space-y-2">
        <Link to="/add-problem" className="text-blue-600 underline block">
          ➕ Upload a New Problem
        </Link>
        <Link to="/analytics" className="text-blue-600 underline block">
          📊 View Student Analytics
        </Link>
      </div>
    </div>
  );
}
