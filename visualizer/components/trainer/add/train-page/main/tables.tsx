import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ClientOnly from "../../../../common/client-only";
import ReactDataGrid from "@inovua/reactdatagrid-community";

const columnsCountTable = [
  { name: "id", type: "number", header: "ID", defaultVisible: false },
  { name: "item", header: "Item", defaultFlex: 1 },
  { name: "duplicate", header: "Duplicate", type: "number" },
];

const columnsSequenceTable = [
  { name: "id", type: "number", label: "ID", defaultVisible: false },
  { name: "sequence", header: "Sequence", defaultFlex: 1 },
  { name: "duplicate", header: "Duplicate", type: "number" },
];

const gridStyleCountTable = {
  minHeight: 200,
  width: "100%",
  zIndex: 1000,
  marginBlock: "1rem",
};

const gridStyleSequenceTable = {
  minHeight: 500,
  width: "100%",
  zIndex: 1000,
  marginBlock: "1rem",
};

const CountTable: React.FC = () => {
  const selexData = useSelector((state: RootState) => state.selexData);

  const dataTable = [
    { id: 0, item: "Total Entry Count", duplicate: selexData.totalLength },
    {
      id: 1,
      item: "Uniquified Entry Count",
      duplicate: selexData.uniqueLength,
    },
    { id: 2, item: "Adapters Matched", duplicate: selexData.matchedLength },
    {
      id: 3,
      item: "Unique Ratio",
      duplicate: selexData.uniqueRatio,
    },
  ];

  return (
    <ClientOnly>
      <ReactDataGrid
        idProperty="id"
        columns={columnsCountTable}
        dataSource={dataTable}
        style={gridStyleCountTable}
        rowStyle={{
          fontFamily: "monospace",
        }}
      />
    </ClientOnly>
  );
};

const SequenceTable: React.FC = () => {
  const selexData = useSelector((state: RootState) => state.selexData);
  const preprocessingConfig = useSelector(
    (state: RootState) => state.preprocessingConfig
  );

  const seqs = selexData.randomRegions.filter(
    (_, index) =>
      selexData.adapterMatched[index] &&
      selexData.duplicates[index] >= (preprocessingConfig.minCount as number)
  );
  const dups = selexData.duplicates.filter(
    (_, index) =>
      selexData.adapterMatched[index] &&
      selexData.duplicates[index] >= (preprocessingConfig.minCount as number)
  );

  let dataSource = [];
  for (let i = 0; i < seqs.length; i++) {
    dataSource.push({
      id: i,
      sequence: seqs[i],
      duplicate: dups[i],
    });
  }
  return (
    <ClientOnly>
      <ReactDataGrid
        idProperty="id"
        columns={columnsSequenceTable}
        dataSource={dataSource}
        style={gridStyleSequenceTable}
        rowStyle={{
          fontFamily: "monospace",
        }}
      />
    </ClientOnly>
  );
};

const Tables: React.FC = () => {
  return (
    <>
      <CountTable />
      <SequenceTable />
    </>
  );
};

export default Tables;
