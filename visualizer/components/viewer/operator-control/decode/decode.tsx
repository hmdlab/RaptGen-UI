import { Form } from "react-bootstrap";
import PointDecoder from "./point-decoder";
import ResultViewer from "./result-viewer";
import DecodeTable from "./decode-table";
import ClientOnly from "../../../common/client-only";

const Decode: React.FC = () => {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Latent Point</Form.Label>
        <PointDecoder />
        <Form.Label>Decoded Sequence</Form.Label>
        <ResultViewer />
        <Form.Label>Sequence List</Form.Label>
        <ClientOnly>
          <DecodeTable />
        </ClientOnly>
      </Form.Group>
    </Form>
  );
};

export default Decode;
