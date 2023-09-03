import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from './userSlice'
import currencyReducer from './currencySlice'
import accountsReducer from './accountsSlice'


const persistConfig = {
  key: "root",
  storage
};

const rootReducer = combineReducers({
  user: userReducer,
  currency: currencyReducer,
  accounts: accountsReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: 
    persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store);

export default store