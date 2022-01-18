import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from '../classes/User';

const initialState:{val:User} = {
    val: new User({login: "", password: ""}),
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action:PayloadAction<User>) => { 
            state.val = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;