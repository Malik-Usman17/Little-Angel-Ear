import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import appReducer from './slices';
import thunk from 'redux-thunk';
import FilesystemStorage from "redux-persist-filesystem-storage";

const persistConfig = {
  key: "root",
  storage: FilesystemStorage
}

let rootReducer = combineReducers({
  appReducers: appReducer
})


let persistedReducer = persistReducer(persistConfig, rootReducer);


const reduxStore = () => {
  let store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
  });
  let persistor = persistStore(store);
  return { store, persistor }
}

export default reduxStore;