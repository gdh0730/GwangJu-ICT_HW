
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note, Priority } from '../types';
import { INITIAL_NOTES } from '../constants';

interface NotesState {
  notes: Note[];
}

const initialState: NotesState = {
  notes: INITIAL_NOTES,
};

// A simple ID generator
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newNote: Note = {
        ...action.payload,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      state.notes.push(newNote);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = { ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
    togglePin: (state, action: PayloadAction<string>) => {
        const note = state.notes.find(n => n.id === action.payload);
        if (note) note.isPinned = !note.isPinned;
    },
    toggleArchive: (state, action: PayloadAction<string>) => {
        const note = state.notes.find(n => n.id === action.payload);
        if (note) {
            note.isArchived = !note.isArchived;
            note.isPinned = false; // Unpin when archiving
        }
    },
    toggleTrash: (state, action: PayloadAction<string>) => {
        const note = state.notes.find(n => n.id === action.payload);
        if (note) {
            note.isTrashed = !note.isTrashed;
            note.isPinned = false; // Unpin when trashing
        }
    },
    deleteNotePermanently: (state, action: PayloadAction<string>) => {
        state.notes = state.notes.filter(note => note.id !== action.payload);
    },
  },
});

export const { addNote, updateNote, togglePin, toggleArchive, toggleTrash, deleteNotePermanently } = notesSlice.actions;

export default notesSlice.reducer;
