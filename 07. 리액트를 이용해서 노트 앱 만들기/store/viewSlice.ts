
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortOptions, ActiveView, SortPriority, SortDate } from '../types';

interface ViewState {
  activeView: ActiveView;
  sortOptions: SortOptions;
}

const initialState: ViewState = {
  activeView: 'notes',
  sortOptions: {
    priority: '',
    date: '',
  },
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<ActiveView>) => {
      state.activeView = action.payload;
    },
    setSortPriority: (state, action: PayloadAction<SortPriority>) => {
        state.sortOptions.priority = action.payload;
        state.sortOptions.date = '';
    },
    setSortDate: (state, action: PayloadAction<SortDate>) => {
        state.sortOptions.date = action.payload;
        state.sortOptions.priority = '';
    },
    clearSort: (state) => {
        state.sortOptions = { priority: '', date: '' };
    }
  },
});

export const { setActiveView, setSortPriority, setSortDate, clearSort } = viewSlice.actions;

export default viewSlice.reducer;
