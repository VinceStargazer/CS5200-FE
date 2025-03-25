import './App.css';
import { Route, Routes } from 'react-router-dom';
import {
  Home,
  Problem,
  Inbox,
  User,
  Login,
  Signup,
  NotFound
} from './pages';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/problems/:problemId" element={<Problem />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/user" element={<User />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
