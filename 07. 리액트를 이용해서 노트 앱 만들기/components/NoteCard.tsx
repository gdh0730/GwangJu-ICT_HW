
import React from 'react';
import { Note } from '../types';
import { useAppDispatch } from '../store/hooks';
import { togglePin, toggleArchive, toggleTrash, deleteNotePermanently } from '../store/notesSlice';
import { NOTE_COLORS } from '../constants';
import { PinIcon, ArchiveIcon, TrashIcon, EditIcon } from './Icons';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const dispatch = useAppDispatch();

  const handlePermanentDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this note?')) {
        dispatch(deleteNotePermanently(note.id));
    }
  }

  return (
    <div className={`p-4 rounded-lg shadow-md flex flex-col justify-between h-56 transition-shadow hover:shadow-xl ${NOTE_COLORS[note.color] || 'bg-white'}`}>
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-bold mb-2 break-words">{note.title}</h3>
          <div className="flex items-center space-x-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${note.priority === 'High' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                {note.priority.toUpperCase()}
            </span>
             {!note.isArchived && !note.isTrashed && (
              <button onClick={(e) => { e.stopPropagation(); dispatch(togglePin(note.id)); }} className="p-1 rounded-full hover:bg-black/10">
                <PinIcon className="h-5 w-5" isFilled={note.isPinned} />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-700 break-words max-h-20 overflow-hidden">{note.content}</p>
      </div>

      <div className="mt-4">
          <div className="flex flex-wrap gap-1 mb-2">
              {note.tags.map(tag => (
                  <span key={tag} className="text-xs bg-black/10 px-2 py-1 rounded-full">{tag}</span>
              ))}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
            <div className="flex items-center space-x-1">
              {!note.isTrashed && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(note); }} className="p-1 rounded-full hover:bg-black/10">
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); dispatch(toggleArchive(note.id)); }} className="p-1 rounded-full hover:bg-black/10">
                    <ArchiveIcon className="h-4 w-4" />
                  </button>
                </>
              )}
              {note.isTrashed && (
                <button onClick={handlePermanentDelete} className="text-red-500 font-semibold">Delete</button>
              )}
              <button onClick={(e) => { e.stopPropagation(); dispatch(toggleTrash(note.id)); }} className="p-1 rounded-full hover:bg-black/10">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default NoteCard;
