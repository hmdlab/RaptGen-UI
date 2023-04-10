import 'bootswatch/dist/cosmo/bootstrap.min.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import { NextPage } from "next";
import Head from "next/head";
import { Col, Container, Form, Row, SSRProvider } from "react-bootstrap";
import { Provider } from "react-redux";
import NavRaptGen from "../components/common/NavRaptGen";
import DataControl from "../components/viewer/data-control/data-control"
import LatentGraph from "../components/viewer/graph/latent-graph";
import OperatorControl from "../components/viewer/operator-control/operator-control"
import { store } from "../components/viewer/redux/store";

const SideBar: React.FC = () => {
    return (
        <div>
            <legend>Data</legend>
            <DataControl />
            <legend>Operation</legend>
            <OperatorControl />
        </div>
    )
};

const VisualizerPage: React.FC = () => {
    return (
        <div>
            <Head>
                <title>RaptGen Visualizer</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <NavRaptGen current_page="viewer" />
                <Container>
                    <h1>Viewer</h1>
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
        </div>
    )
}

const Home: NextPage = () => {
    return (
        // <SSRProvider>
        //     <Provider store={store}>
        //         <VisualizerPage />
        //     </Provider>
        // </SSRProvider>
        <Provider store={store}>
            <VisualizerPage />
        </Provider>
    )
}

export default Home