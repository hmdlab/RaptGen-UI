import "bootswatch/dist/cosmo/bootstrap.min.css";
import { NextPage } from "next";
import { Provider } from "react-redux";
import { store } from "../components/viewer/redux/store";
import Head from "next/head";
import Navigator from "../components/common/navigator";
import { Col, Container, Row } from "react-bootstrap";
import LatentGraph from "../components/viewer/graph/latent-graph";
import axios from "axios";
import DataControl from "../components/viewer/data-control/data-control";
import OperatorControl from "../components/viewer/operator-control/operator-control";
import SelectionTable from "../components/viewer/graph/selection-table";
import ClientOnly from "../components/common/client-only";

axios.defaults.baseURL = "http://localhost:8000/api";

const SideBar: React.FC = () => {
  return (
    <div>
      <legend>Data</legend>
      <DataControl />
      <legend>Operation</legend>
      <OperatorControl />
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>RaptGen Visualizer: Viewer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navigator currentPage="viewer" />
        <Container>
          <h1 style={{ marginTop: "1rem" }}>Viewer</h1>
          <hr />
          <Row>
            <Col md={4}>
              <SideBar />
            </Col>
            <Col>
              <LatentGraph />
              <ClientOnly>
                <SelectionTable />
              </ClientOnly>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

const PageRoot: NextPage = () => {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

export default PageRoot;
