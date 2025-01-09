import "bootswatch/dist/cosmo/bootstrap.min.css";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import Navigator from "~/components/common/navigator";
import "@inovua/reactdatagrid-community/index.css";
import SideBar from "~/components/gmm/home/sidebar/sidebar";
import Main from "~/components/gmm/home/main/main";
import Footer from "~/components/common/footer";

const Home: React.FC = () => {
  return (
    <div className="vh-100 d-flex flex-column">
      <Navigator currentPage="gmm-trainer" />
      <main>
        <Container>
          <h1 style={{ marginTop: "1rem" }}>GMM Trainer</h1>
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
      <Footer />
    </div>
  );
};

const PageRoot: NextPage = () => {
  return (
    <>
      <Head>
        <title>RaptGen-UI: GMM Trainer</title>
        <meta
          name="description"
          content="Train page for Gaussian Mixture Model"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
    </>
  );
};

export default PageRoot;
