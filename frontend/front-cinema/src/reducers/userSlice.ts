import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from '../classes/User';

const initialState = {
    val: new User("",""),
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action:PayloadAction<User>) => {  // :PayloadAction<number>
            state.val = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;