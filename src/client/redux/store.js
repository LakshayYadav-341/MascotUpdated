import authReducer from "@client/components/auth/authSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from "reduxjs-toolkit-persist";
import sessionStorage from "reduxjs-toolkit-persist/es/storage/session";
import autoMergeLevel1 from "reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1";
import userReducer from "../components/auth/user/userSlice";
import postReducer from "../components/posts/postSlice";

const persistConfig = {
    key: "root",
    version: 1,
    storage: sessionStorage,
    stateReconciler: autoMergeLevel1,
};

const reducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    post: postReducer,
});
const _persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: _persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(thunk),
});

export const persistor = persistStore(store);
