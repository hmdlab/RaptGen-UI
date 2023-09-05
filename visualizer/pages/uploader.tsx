import "bootswatch/dist/cosmo/bootstrap.min.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

import { NextPage } from "next";
import { Provider } from "react-redux";
import Head from "next/head";
import Navigator from "../components/common/navigator";
import { Col, Container, Row } from "react-bootstrap";
import SideBar from "../components/uploader/sidebar";
import LatentGraph from "../components/uploader/graph/latent-graph";
import { store } from "../components/uploader/redux/store";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>RaptGen Visualizer: Uploader</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navigator currentPage="uploader" />
        <Container>
          <h1 style={{ marginTop: "1rem" }}>Uploader</h1>
          <hr />
          <Row>
            <Col md={4}>
              <SideBar />
            </Col>
            <Col>
              <LatentGraph />
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
