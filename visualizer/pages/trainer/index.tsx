import "bootswatch/dist/cosmo/bootstrap.min.css";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import Navigator from "../../components/common/navigator";
import SideBar from "../../components/trainer/home/sidebar/sidebar";
import { Provider } from "react-redux";
import { store } from "../../components/trainer/home/redux/store";
import Main from "../../components/trainer/home/main/main";
import "@inovua/reactdatagrid-community/index.css";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>RaptGen Visualizer: Trainer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navigator currentPage="uploader" />
        <Container>
          <h1 style={{ marginTop: "1rem" }}>Trainer</h1>
          <hr />
          <Row>
            <Col md={4}>
              <SideBar />
            </Col>
            <Col>
              <Main />
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
