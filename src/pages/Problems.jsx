import { Navbar, Container, ProblemList } from '../components';
import AddProblem from './AddProblem';
export default function Problems() {
  return (
    <>
      <Navbar selected={1} />
      <Container>
          <AddProblem />
          <ProblemList />
      </Container>
    </>
  );
}
