import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Table from '../classes/Table';
import moment from "moment";
import Employee from '../classes/Employee';

const initialState:{val:Table} = {
    // val: new Employee("admin","123","proger","admin"),
    val: new Table(moment()),
}

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setDate: (state, action:PayloadAction<moment.Moment>) => {  // :PayloadAction<number>
            state.val.setDate(action.payload);
        },
    },
});

export const { setDate } = tableSlice.actions;
export default tableSlice.reducer;