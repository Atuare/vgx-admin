import { IExam } from "@/interfaces/exams.interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface IExamState {
  exam: IExam | null;
}

const initialState: IExamState = {
  exam: null,
};

export const examSlice = createSlice({
  initialState,
  name: "examSlice",
  reducers: {
    setExam: (state, action: PayloadAction<IExam>) => {
      state.exam = action.payload;
    },
  },
});

export const { setExam } = examSlice.actions;

export default examSlice.reducer;
