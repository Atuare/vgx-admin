import { ProcessType } from "@/interfaces/process.interface";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface IProcessEditState {
  processEdit: ProcessType | null;
}

const initialState: IProcessEditState = {
  processEdit: null,
};

const processEditSlice = createSlice({
  name: "processEditSlice",
  initialState,
  reducers: {
    setProcessEdit(state, action: PayloadAction<ProcessType>) {
      state.processEdit = action.payload;
    },
  },
});

export const { setProcessEdit } = processEditSlice.actions;
export default processEditSlice.reducer;
