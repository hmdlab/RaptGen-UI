import { Form } from "react-bootstrap";

type Props = {
  predicate: (value: number) => boolean;
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
  value: number | undefined;
  isValid: boolean;
  label: string;
  placeholder: string;
};

// if empty, value equals undefined
const IntegerForm: React.FC<Props> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue) {
      const value = parseInt(e.target.value);
      props.setIsValid(!isNaN(value) && props.predicate(value));
      props.setValue(value);
    } else {
      const value = undefined;
      props.setIsValid(true);
      props.setValue(value);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        value={props.value ?? ""}
        onChange={handleChange}
        type="number"
        placeholder={props.placeholder}
        isInvalid={!props.isValid}
      />
      <Form.Control.Feedback type="invalid">
        Please enter a valid integer.
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default IntegerForm;
