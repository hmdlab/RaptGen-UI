import { useEffect, useState } from "react";
import { Form, Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { apiClient } from "~/services/api-client";
import { RootState } from "../redux/store";

const VaeSelector: React.FC = () => {
  const [models, setModels] = useState<
    {
      uuid: string;
      name: string;
    }[]
  >([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [minimumCount, setMinimumCount] = useState<number>(5);
  const [showSelex, setShowSelex] = useState<boolean>(true);

  const dispatch = useDispatch();
  const graphConfig = useSelector((state: RootState) => state.graphConfig);
  const sessionConfig = useSelector((state: RootState) => state.sessionConfig);
  const registeredValues = useSelector(
    (state: RootState) => state.registeredValues
  );

  // retrieve VAE model names
  useEffect(() => {
    (async () => {
      const res = await apiClient.getVAEModelNames();
      setModels(res.entries);
    })();
  }, []);

  // if redux store is changed, update local state
  useEffect(() => {
    setSelectedModel(sessionConfig.vaeId);
    setMinimumCount(graphConfig.minCount);
    setShowSelex(graphConfig.showSelex);
  }, [sessionConfig, graphConfig]);

  const setDirty = () => {
    dispatch({
      type: "isDirty/set",
      payload: true,
    });
  };

  const onModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uuid = e.target.value;
    setDirty();
    setSelectedModel(uuid);

    try {
      const resStart = await apiClient.startSession({
        queries: {
          vae_uuid: uuid,
        },
      });
      const resEnd = await apiClient.endSession({
        queries: {
          session_uuid: sessionConfig.sessionId,
        },
      });
      dispatch({
        type: "sessionConfig/set",
        payload: {
          sessionId: resStart.uuid,
          vaeId: uuid,
        },
      });
      dispatch({
        type: "graphConfig/set",
        payload: {
          ...graphConfig,
          vaeId: uuid,
        },
      });

      // retrieve SELEX data
      const resSelex = await apiClient.getSelexData({
        queries: {
          vae_uuid: uuid,
        },
      });
      dispatch({
        type: "vaeData/set",
        payload: Array.from({ length: resSelex.coord_x.length }, (_, i) => ({
          key: i,
          randomRegion: resSelex.random_regions[i],
          coordX: resSelex.coord_x[i],
          coordY: resSelex.coord_y[i],
          duplicates: resSelex.duplicates[i],
          isSelected: false,
          isShown: false,
        })),
      });

      // update registered table with re-encoded data
      if (registeredValues.randomRegion.length !== 0) {
        const resRegistered = await apiClient.encode({
          session_uuid: resStart.uuid,
          sequences: registeredValues.randomRegion,
        });
        dispatch({
          type: "registeredValues/set",
          payload: {
            ...registeredValues,
            coordX: resRegistered.coords_x,
            coordY: resRegistered.coords_y,
          },
        });
      }

      // reset queried values and acquisition values
      dispatch({
        type: "queriedValues/set",
        payload: {
          randomRegion: [],
          coordX: [],
          coordY: [],
          coordOriginalX: [],
          coordOriginalY: [],
          staged: [],
        },
      });
      dispatch({
        type: "acquisitionValues/set",
        payload: {
          acquisitionValues: [],
          coordX: [],
          coordY: [],
        },
      });
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const onMinimumCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty();
    setMinimumCount(parseInt(e.currentTarget.value));

    if (isNaN(parseInt(e.currentTarget.value))) {
      return;
    }

    try {
      dispatch({
        type: "graphConfig/set",
        payload: {
          ...graphConfig,
          minCount: parseInt(e.currentTarget.value),
        },
      });
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const onShowSelexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty();
    setShowSelex(e.currentTarget.checked);

    try {
      dispatch({
        type: "graphConfig/set",
        payload: {
          ...graphConfig,
          showSelex: e.currentTarget.checked,
        },
      });
    } catch (e) {
      console.error(e);
      return;
    }
  };

  return (
    <>
      <legend>VAE model</legend>
      <Tabs defaultActiveKey="modelSelector" className="mb-3">
        <Tab eventKey="modelSelector" title="Select">
          <Form.Group className="mb-3">
            <Form.Label>Selected VAE model</Form.Label>
            <Form.Select value={selectedModel} onChange={onModelChange}>
              {models.map((model, i) => (
                <option key={i} value={model.uuid}>
                  {model.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Tab>
        <Tab eventKey="modelConfig" title="Config">
          <Form.Group className="mb-3">
            <Form.Label>Minimum count</Form.Label>
            <Form.Control
              type="number"
              value={minimumCount}
              onChange={onMinimumCountChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Switch
              label="show SELEX dataset"
              checked={showSelex}
              onChange={onShowSelexChange}
            />
          </Form.Group>
        </Tab>
      </Tabs>
    </>
  );
};

export default VaeSelector;
