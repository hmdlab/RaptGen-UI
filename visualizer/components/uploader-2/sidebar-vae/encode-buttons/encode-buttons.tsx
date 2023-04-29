import { useEffect, useState } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";

type Props = {
  encodeDisabled: boolean;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  vaeFile: File | null;
};

const EncodeButtons: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const requiredParams = useSelector(
    (state: RootState) => state.vaeConfig.requiredParams
  );
  const sequenceData = useSelector(
    (state: RootState) => state.vaeConfig.sequenceData
  );

  const handleBack = () => {
    dispatch({
      type: "uploadConfig/setRoute",
      payload: "/",
    });
  };

  const handleEncode = () => {
    (async () => {
      if (props.isDirty) {
        // check if each of seqs has forward and reverse adapters
        const seqs = sequenceData.sequences;
        const forwardAdapter = requiredParams.forwardAdapter;
        const reverseAdapter = requiredParams.reverseAdapter;
        const masks = seqs.map((seq) => {
          return seq.startsWith(forwardAdapter) && seq.endsWith(reverseAdapter);
        });
        const randomRegions = seqs.map((seq, i) => {
          if (masks[i]) {
            return seq.slice(
              forwardAdapter.length,
              seq.length - reverseAdapter.length
            );
          } else {
            return "";
          }
        });

        // get uuid
        const formData = new FormData();
        if (!props.vaeFile) {
          return;
        }
        formData.append("state_dict", props.vaeFile);
        formData.append("seqs", randomRegions.filter((e) => e).join(","));
        console.log(randomRegions.join(","));

        const res = await axios
          .post("/upload/batch-encode", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => res.data);
        if (res.status === "success") {
          const uuid: string = res.data.task_id;

          // dispatch to redux
          dispatch({
            type: "vaeConfig/setUUID",
            payload: uuid,
          });
          dispatch({
            type: "vaeConfig/setData",
            payload: {
              ...sequenceData,
              randomRegions: randomRegions,
              adapterMatched: masks,
              matchedLength: masks.reduce((acc, cur) => acc + (cur ? 1 : 0), 0),
            },
          });
        }
        props.setIsDirty(false);
      }

      dispatch({
        // type: 'uploadConfig/setRoute',
        type: "uploadConfig/setRoute",
        payload: "/vae/encode",
      });
    })();
  };

  return (
    <>
      <ButtonToolbar className="justify-content-between">
        <Button className="col-3" onClick={handleBack}>
          Back
        </Button>
        <Button
          disabled={props.encodeDisabled}
          className="col-3"
          onClick={handleEncode}
        >
          Encode
        </Button>
      </ButtonToolbar>
    </>
  );
};

export default EncodeButtons;
