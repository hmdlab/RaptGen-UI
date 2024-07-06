import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type QueriedValues = {
  randomRegion: string[];
  coordX: number[];
  coordY: number[];
  columnNames: string[];
  sequenceIndex: number[];
};

const queriedValuesSlice = createSlice({
  name: "queriedValues",
  initialState: {
    randomRegion: [],
    coordX: [],
    coordY: [],
    columnNames: [],
    sequenceIndex: [],
  } as QueriedValues,
  reducers: {
    set: (state: QueriedValues, action: PayloadAction<QueriedValues>) => {
      return action.payload;
    },
  },
});

const queriedValuesReducer = queriedValuesSlice.reducer;

export default queriedValuesReducer;
export type { QueriedValues };
