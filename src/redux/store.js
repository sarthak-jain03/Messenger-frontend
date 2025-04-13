import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const savedToken = localStorage.getItem('token');

const preloadedState = {
  user: {
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    token: savedToken || "",
    onlineUser: [],
    socketConnection: null
  }
};

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState,
});
