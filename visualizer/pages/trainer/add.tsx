import "bootswatch/dist/cosmo/bootstrap.min.css";
import { NextPage } from "next";
import Head from "next/head";
import { Container } from "react-bootstrap";
import Navigator from "../../components/common/navigator";
import { Provider } from "react-redux";
import { RootState, store } from "../../components/trainer/add/redux/store";
import { useSelector } from "react-redux";
import SelexPage from "../../components/trainer/add/selex-page/selex-page";
import TrainPage from "../../components/trainer/add/train-page/train-page";
import "@inovua/reactdatagrid-community/index.css";

const Home: React.FC = () => {
  const route = useSelector((state: RootState) => state.pageConfig.pseudoRoute);

  return (
    <>
      <Head>
        <title>RaptGen Visualizer: Trainer/add</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navigator currentPage="uploader" />
        <Container>
          <h1 style={{ marginTop: "1rem" }}>Trainer</h1>
          <hr />
          <div style={{ display: route === "/selex" ? "block" : "none" }}>
            <SelexPage />
          </div>
          <div style={{ display: route === "/train" ? "block" : "none" }}>
            <TrainPage />
          </div>
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
