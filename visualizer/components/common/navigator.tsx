import { Navbar, Nav, Container } from "react-bootstrap";

type Props = {
  currentPage: "viewer" | "uploader" | "trainer" | "bayesopt";
};

const Navigator: React.FC<Props> = ({ currentPage }) => {
  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand>RaptGen Visualizer</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/viewer">Viewer</Nav.Link>
          <Nav.Link href="/uploader">Uploader</Nav.Link>
          <Nav.Link href="/trainer">Trainer</Nav.Link>
          <Nav.Link href="/bayesopt">Bayesian Optimization</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigator;
