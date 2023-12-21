import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import rootReducer from "./features";
const persistConfig = {
	key: "root",
	storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [];

if (process.env.NODE_ENV === "development") {
	middleware.push(logger);
}

const store = configureStore({
	reducer: persistedReducer,
	middleware
});

const persister = persistStore(store);
const dispatch = store.dispatch;
export { store, persister, dispatch };