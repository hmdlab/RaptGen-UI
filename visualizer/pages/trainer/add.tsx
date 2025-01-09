import "bootswatch/dist/cosmo/bootstrap.min.css";
import { NextPage } from "next";
import Head from "next/head";
import { Container } from "react-bootstrap";
import Navigator from "~/components/common/navigator";
import { Provider } from "react-redux";
import { store } from "~/components/trainer/add/redux/store";
import SelexPage from "~/components/trainer/add/selex-page/selex-page";
import TrainPage from "~/components/trainer/add/train-page/train-page";
import "@inovua/reactdatagrid-community/index.css";
import { useRouter } from "next/router";
import Footer from "~/components/common/footer";

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <div className="d-flex flex-column vh-100">
      <main>
        <Navigator currentPage="vae-trainer" />
        <Container>
          <h1 style={{ marginTop: "1rem" }}>VAE Trainer</h1>
          <hr />
          <div
            style={{
              display: router.query.page === undefined ? "block" : "none",
            }}
          >
            <SelexPage />
          </div>
          <div
            style={{
              display: router.query.page === "raptgen" ? "block" : "none",
            }}
          >
            <TrainPage />
          </div>
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
        <title>RaptGen-UI: Trainer</title>
        <meta name="description" content="Train page for pHMM-VAE" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <Home />
      </Provider>
    </>
  );
};

export default PageRoot;
