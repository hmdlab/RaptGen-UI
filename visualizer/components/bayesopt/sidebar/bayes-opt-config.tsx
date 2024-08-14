import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const BayesOptConfig: React.FC = () => {
  const dispatch = useDispatch();
  const columns = useSelector(
    (state: RootState) => state.registeredValues.columnNames
  );
  const bayesoptConfig = useSelector(
    (state: RootState) => state.bayesoptConfig
  );
  const graphConfig = useSelector((state: RootState) => state.graphConfig);
  const router = useRouter();
  const uuid = router.query.uuid;

  const onChangeColumnName = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "bayesoptConfig/set",
      payload: {
        ...bayesoptConfig,
        targetColumn: event.target.value,
      },
    });
    dispatch({
      type: "isDirty/set",
      payload: true,
    });
  };

  const onChangeBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "bayesoptConfig/set",
      payload: {
        ...bayesoptConfig,
        queryBudget: Number(e.target.value),
      },
    });
    dispatch({
      type: "isDirty/set",
      payload: true,
    });
  };

  const onChangeShowContour = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "graphConfig/set",
      payload: {
        ...graphConfig,
        showAcquisition: e.target.checked,
      },
    });
    dispatch({
      type: "isDirty/set",
      payload: true,
    });
  };

  useEffect(() => {
    if (uuid) return;

    if (columns.length > 0) {
      dispatch({
        type: "bayesoptConfig/set",
        payload: {
          ...bayesoptConfig,
          optimizationType: "qEI",
          targetColumn: columns[0],
        },
      });
    }
  }, [columns]);

  return (
    <>
      <legend>Bayes-Opt Configuration</legend>
      <Form.Group className="mb-3">
        <Form.Label>Optimization method</Form.Label>
        <Form.Control
          as="select"
          value={bayesoptConfig.optimizationType}
          onChange={() => {}}
        >
          <option>qEI (multiple query)</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>The name of the value to optimize</Form.Label>
        <Form.Select
          onChange={onChangeColumnName}
          value={bayesoptConfig.targetColumn}
        >
          {columns.map((column) => (
            <option key={column}>{column}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Query budget (The number of proposal values)</Form.Label>
        <Form.Control
          type="number"
          onChange={onChangeBudget}
          value={bayesoptConfig.queryBudget}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Switch
          onChange={onChangeShowContour}
          checked={graphConfig.showAcquisition}
          label="show contour plot"
        />
      </Form.Group>
    </>
  );
};

export default BayesOptConfig;
