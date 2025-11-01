
import { Note, Tag, Priority } from './types';

export const NOTE_COLORS: { [key: string]: string } = {
  White: 'bg-white',
  Red: 'bg-red-200',
  Blue: 'bg-blue-200',
  Green: 'bg-green-200',
  Yellow: 'bg-yellow-200',
  Purple: 'bg-purple-200',
};

export const NOTE_PRIORITIES: Priority[] = ['Low', 'High'];

export const INITIAL_TAGS: Tag[] = [
    { id: '1', name: 'Exercise' },
    { id: '2', name: 'Quotes' },
    { id: '3', name: 'Coding' },
];

export const INITIAL_NOTES: Note[] = [
    {
        id: 'note-1',
        title: 'Note 1 title',
        content: 'Note 1 content',
        tags: ['Coding'],
        color: 'Blue',
        priority: 'High',
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'note-2',
        title: 'Note 2 title',
        content: 'Note 2 content',
        tags: ['Exercise'],
        color: 'Red',
        priority: 'High',
        isPinned: true,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
     {
        id: 'note-3',
        title: '노트1',
        content: '노트1',
        tags: ['Exercise'],
        color: 'Red',
        priority: 'High',
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
