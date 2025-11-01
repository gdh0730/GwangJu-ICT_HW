
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { NoteModal, EditTagsModal } from './components/modals';
import { Note } from './types';

function App() {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditTagsModalOpen, setIsEditTagsModalOpen] = useState(false);

  const handleOpenNoteModal = (note: Note | null) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="flex h-screen font-sans text-gray-800">
      <Sidebar onEditTags={() => setIsEditTagsModalOpen(true)} />
      <main className="flex-1 overflow-y-auto">
        <MainContent onEditNote={handleOpenNoteModal} />
      </main>
      
      {isNoteModalOpen && (
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={handleCloseNoteModal}
          note={editingNote}
        />
      )}

      {isEditTagsModalOpen && (
          <EditTagsModal
            isOpen={isEditTagsModalOpen}
            onClose={() => setIsEditTagsModalOpen(false)}
          />
      )}
    </div>
  );
}

export default App;
