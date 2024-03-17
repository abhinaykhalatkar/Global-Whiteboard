import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserInfo = {
  isLoggedIn: false,
  userEmail: "",
};

export const userInfoSlice = createSlice({
  name: "updateUserInfo",
  initialState: initialState,
  reducers: {
    addUser: (state: UserInfo, action: PayloadAction<UserInfo>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.userEmail = action.payload.userEmail;
    },
    removeUser: (state: UserInfo) => {
      state.isLoggedIn = false;
      state.userEmail = "";
    },
  },
});

export const { addUser, removeUser } = userInfoSlice.actions;

export default userInfoSlice.reducer;
