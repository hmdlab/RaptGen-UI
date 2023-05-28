import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import axios from "axios";

type Props = {
  value: number;
  isValid: boolean;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormTargetLength: React.FC<Props> = (props) => {
  // raw input value, this may be string or number
  const [value, setValue] = useState<string>("");

  const sequences = useSelector(
    (state: RootState) => state.vaeConfig.sequenceData.sequences
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const numValue = parseInt(e.target.value);
    props.setValue(numValue);
    props.setIsValid(!isNaN(numValue) && numValue > 0);
  };

  const handleEstimate = () => {
    (async () => {
      const res = await axios
        .post("/upload/estimate-target-length", {
          sequences: sequences,
        })
        .then((res) => res.data);

      if (res.status === "success") {
        const value: number = res.data["target_length"];
        setValue(value.toString());
        props.setValue(value);
        props.setIsValid(true);
      }
    })();
  };

  return (
    <InputGroup>
      <Form.Control
        value={value}
        onChange={handleChange}
        type="number"
        placeholder="Please enter the target length"
        isInvalid={!props.isValid && value !== ""}
      />
      <Button variant="outline-primary" onClick={handleEstimate}>
        Estimate
      </Button>
    </InputGroup>
  );
};

export default FormTargetLength;
