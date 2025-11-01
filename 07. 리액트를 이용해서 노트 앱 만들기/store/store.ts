
import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';
import tagsReducer from './tagsSlice';
import viewReducer from './viewSlice';

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('keep-notes-state', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('keep-notes-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    tags: tagsReducer,
    view: viewReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
