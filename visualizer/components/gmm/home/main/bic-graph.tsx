import dynamic from "next/dynamic";
import { Layout, ViolinData } from "plotly.js";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type BicProps = {
  n_components: number[];
  values: number[];
  step_size: number;
};

const BicGraph: React.FC<BicProps> = (props) => {
  const hues = new Set(props.n_components);

  const bicData: Partial<ViolinData> = {
    type: "violin",
    x: props.values,
    y: props.n_components,
    line: {
      color: "black",
    },
    opacity: 0.5,
    side: "positive",
    orientation: "h",
    points: "all",
    box: {
      visible: true,
    },
    width: 5,
    jitter: 0.1,
    marker: {
      opacity: 0.5,
    },
  };

  const layout: Partial<Layout> = {
    xaxis: {
      zeroline: false,
      title: "BIC value",
    },
    yaxis: {
      title: "Number of components",
      range: [
        Math.min(...props.n_components) - props.step_size,
        Math.max(...props.n_components) + props.step_size,
      ],
    },
    height: hues.size * 30 + 200,
    margin: {
      l: 100,
      r: 100,
      b: 50,
      t: 50,
    },
  };
  return (
    <Plot
      data={[bicData]}
      useResizeHandler={true}
      layout={layout}
      config={{ responsive: true }}
      style={{ width: "100%" }}
    />
  );
};

export default BicGraph;
