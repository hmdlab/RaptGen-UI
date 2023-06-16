import axios from "axios";
import React, { useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { ChevronLeft } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/router";

const Pagenation: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const trainConfig = useSelector((state: RootState) => state.trainConfig);
  const preprocessingConfig = useSelector(
    (state: RootState) => state.preprocessingConfig
  );
  const experimentName = useSelector(
    (state: RootState) => state.pageConfig.experimentName
  );
  const selexData = useSelector((state: RootState) => state.selexData);
  const modelType = useSelector(
    (state: RootState) => state.pageConfig.modelType
  );

  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      (async () => {
        const dupsMask = selexData.duplicates.map((dup) => {
          return dup >= (preprocessingConfig.minCount as number);
        });
        const response = await axios.post("/train/jobs/submit", {
          type: modelType,
          name: experimentName,
          params_preprocessing: {
            forward: preprocessingConfig.forwardAdapter,
            reverse: preprocessingConfig.reverseAdapter,
            random_region_length:
              (preprocessingConfig.targetLength ?? 0) -
              (preprocessingConfig.forwardAdapter?.length ?? 0) -
              (preprocessingConfig.reverseAdapter?.length ?? 0),
            tolerance: preprocessingConfig.tolerance,
            minimum_count: preprocessingConfig.minCount,
          },
          random_regions: selexData.randomRegions.filter((seq, index) => {
            return dupsMask[index] && selexData.adapterMatched[index];
          }),
          duplicates: selexData.duplicates.filter((dup, index) => {
            return dupsMask[index] && selexData.adapterMatched[index];
          }),
          reiteration: trainConfig.reiterations,
          params_training: {
            model_length: trainConfig.modelLength,
            epochs: trainConfig.epochs,
            match_forcing_duration: trainConfig.forceMatchEpochs,
            beta_duration: trainConfig.betaScheduleEpochs,
            early_stopping: trainConfig.earlyStoppingEpochs,
            seed_value: trainConfig.seed,
            match_cost: trainConfig.matchCost,
            device: trainConfig.device,
          },
        });
        if (response.status === 200) {
          router.push("/trainer");
        } else {
          alert("Failed to submit a job.");
          setIsLoading(false);
        }
        return selexData;
      })();
    }
  }, [isLoading]);

  const onClickBack = () => {
    dispatch({
      type: "pageConfig/setPseudoRoute",
      payload: "/selex",
    });
  };

  const onClickTrain = () => {
    setIsLoading(true);
  };

  return (
    <div className="d-flex justify-content-between my-3">
      <Button onClick={onClickBack} variant="primary">
        <ChevronLeft />
        Back
      </Button>
      <Button
        onClick={onClickTrain}
        variant="primary"
        disabled={!trainConfig.isValidParams}
      >
        {isLoading ? <Spinner animation="border" size="sm" /> : "Train"}
      </Button>
    </div>
  );
};

export default Pagenation;
