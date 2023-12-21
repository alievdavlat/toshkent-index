import systemReducer from "./system";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
	system: systemReducer
});

export default rootReducer;
