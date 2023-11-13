import { configureStore } from '@reduxjs/toolkit';
import gameReducer from "../features/gameSlice"

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;