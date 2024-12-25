import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkUser, createUser, signOut, updateLoggedInUser } from "./authAPI";
import { updateUser } from "./user/userAPI";
import { toast } from "react-toastify";

const initialState = {
  isUserCreated: false,
  loggedInUser: JSON.parse(localStorage.getItem('session')) || null,
  updatedLoggedInUser: null,
  createdUser: null,
  status: "idle",
  error: null,
};

export const createUserAsync = createAsyncThunk(
  "user/createUser",
  async (userData) => {
    const response = await createUser(userData);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  async (update) => {
    const response = await updateUser(update);
    return response.data;
  }
);

export const updateLoggedInUserAsync = createAsyncThunk(
  'user/updateLoggedInuser',
  async()=>{
    const res = await updateLoggedInUser();
    // console.log(res.data);
    return res.data;
  }
)

export const checkUserAsync = createAsyncThunk(
  "user/checkUser",
  async (loginInfo) => {
    const response = await checkUser(loginInfo);
    // The value we return becomes the `fulfilled` action payload
    if(response?.status === "success"){
      toast.success("Logged In Successfully")
    }
    return response.data;
  }
);

export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async (loginInfo) => {
    const response = await signOut(loginInfo);
    if(response?.data === "success"){
      toast.success("Logged Out Successfully")
    }
    else{
      toast.error("Something went wrong!!")
    }
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.createdUser = action.payload;
        state.isUserCreated = true;
        toast.success("Account Created Successfully")
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.status = "idle"
        toast.error("Something went wrong")
      })
      .addCase(checkUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null
        localStorage.removeItem("session")
        localStorage.setItem("session", JSON.stringify(action.payload))
        state.loggedInUser = action.payload;
      })
      .addCase(checkUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error;
        toast.error("Wrong Credentials")
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.createdUser = action.payload;
      })
      .addCase(updateLoggedInUserAsync.pending,(state) => {
        state.status = 'loading';
      })
      .addCase(updateLoggedInUserAsync.fulfilled, (state, action)=>{
        state.status = "idle";
        state.updatedLoggedInUser = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = 'idle';
        localStorage.removeItem("session")
        state.loggedInUser = null;
        state.updatedLoggedInUser = null;
        state.createdUser = null;
      })

  },
});

export const selectLoggedInUser = (state) => state.auth.loggedInUser?.user;
export const selectSession = (state) => state.auth.loggedInUser;
export const selectCreatedUser = (state) => state.auth.createdUser;
export const selectError = (state) => state.auth.error;
export const selectUserCreated = (state) => state.auth.isUserCreated;
export const selectLoginStatus = (state) => state.auth.status;

// export const { } = authSlice.actions;

export default authSlice.reducer;
