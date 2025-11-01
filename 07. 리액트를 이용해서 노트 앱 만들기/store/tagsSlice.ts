
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../types';
import { INITIAL_TAGS } from '../constants';

interface TagsState {
  tags: Tag[];
}

const initialState: TagsState = {
  tags: INITIAL_TAGS,
};

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<string>) => {
      const name = action.payload.trim();
      if (name && !state.tags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) {
        state.tags.push({ id: uuidv4(), name });
      }
    },
    deleteTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter((tag) => tag.name !== action.payload);
    },
  },
});

export const { addTag, deleteTag } = tagsSlice.actions;

export default tagsSlice.reducer;
