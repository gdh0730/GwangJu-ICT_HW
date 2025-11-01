
import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { Note } from '../types';
import NoteCard from './NoteCard';
import { SortModal } from './modals';
import { PlusIcon } from './Icons';

interface MainContentProps {
  onEditNote: (note: Note | null) => void;
}

const MainContent: React.FC<MainContentProps> = ({ onEditNote }) => {
  const { notes } = useAppSelector((state) => state.notes);
  const { activeView, sortOptions } = useAppSelector((state) => state.view);
  const { tags } = useAppSelector((state) => state.tags);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    let filtered: Note[] = [];

    if (activeView === 'notes') {
      filtered = notes.filter(note => !note.isArchived && !note.isTrashed);
    } else if (activeView === 'archive') {
      filtered = notes.filter(note => note.isArchived && !note.isTrashed);
    } else if (activeView === 'trash') {
      filtered = notes.filter(note => note.isTrashed);
    } else {
      // It's a tag view
      filtered = notes.filter(note => note.tags.includes(activeView) && !note.isArchived && !note.isTrashed);
    }
    return filtered;
  }, [notes, activeView]);
  
  const sortedNotes = useMemo(() => {
    const toSort = [...filteredNotes];
    
    if (sortOptions.priority) {
      toSort.sort((a, b) => {
        const priorityA = a.priority === 'High' ? 1 : 0;
        const priorityB = b.priority === 'High' ? 1 : 0;
        return sortOptions.priority === 'high-to-low' ? priorityB - priorityA : priorityA - priorityB;
      });
    } else if (sortOptions.date) {
      toSort.sort((a, b) => {
        const dateA = new Date(sortOptions.date === 'created' ? a.createdAt : a.updatedAt).getTime();
        const dateB = new Date(sortOptions.date === 'created' ? b.createdAt : b.updatedAt).getTime();
        return sortOptions.date === 'latest' ? dateB - dateA : dateA - dateB;
      });
    }
    return toSort;
  }, [filteredNotes, sortOptions]);

  const pinnedNotes = sortedNotes.filter(note => note.isPinned);
  const otherNotes = sortedNotes.filter(note => !note.isPinned);

  const title = activeView === 'notes' || activeView === 'archive' || activeView === 'trash' 
    ? activeView.charAt(0).toUpperCase() + activeView.slice(1)
    : activeView;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-600">{title}</h2>
        {activeView !== 'archive' && activeView !== 'trash' && (
           <button onClick={() => onEditNote(null)} className="p-2 rounded-full hover:bg-gray-200">
               <PlusIcon className="h-6 w-6 text-gray-600" />
           </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <input
            type="text"
            placeholder="노트 작성을 시작하세요."
            onClick={() => onEditNote(null)}
            readOnly
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
        />
      </div>

      <div className="flex justify-end mb-4 relative">
        <button onClick={() => setIsSortModalOpen(true)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          정렬
        </button>
        {isSortModalOpen && <SortModal onClose={() => setIsSortModalOpen(false)} />}
      </div>
      
      {pinnedNotes.length > 0 && (
          <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Pinned Notes ({pinnedNotes.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {pinnedNotes.map(note => <NoteCard key={note.id} note={note} onEdit={onEditNote} />)}
              </div>
          </div>
      )}

      {otherNotes.length > 0 && (
          <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">All Notes ({otherNotes.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {otherNotes.map(note => <NoteCard key={note.id} note={note} onEdit={onEditNote} />)}
              </div>
          </div>
      )}

      {filteredNotes.length === 0 && (
        <div className="text-center text-gray-500 mt-16">
            <p>노트가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
