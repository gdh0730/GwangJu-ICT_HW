
import React, { useState, useEffect } from 'react';
import { Note, Tag, Priority, SortPriority, SortDate } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNote, updateNote } from '../store/notesSlice';
import { addTag, deleteTag } from '../store/tagsSlice';
import { setSortPriority, setSortDate, clearSort } from '../store/viewSlice';
import { NOTE_COLORS, NOTE_PRIORITIES } from '../constants';
import { XIcon, PlusIcon } from './Icons';

// Generic Modal Wrapper
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; widthClass?: string }> = ({ isOpen, onClose, children, widthClass = "max-w-lg" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className={`bg-white rounded-lg shadow-xl w-full ${widthClass}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// Add/Assign Tags Modal (used within NoteModal)
const AssignTagModal: React.FC<{
    selectedTags: string[];
    onToggleTag: (tagName: string) => void;
    onClose: () => void;
    onAddNewTag: (tagName: string) => void;
}> = ({ selectedTags, onToggleTag, onClose, onAddNewTag }) => {
    const allTags = useAppSelector(state => state.tags.tags);
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim()) {
            onAddNewTag(newTag.trim());
            setNewTag('');
        }
    };
    
    return (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg p-4 w-64 z-20 border">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">ADD Tags</h4>
                <button onClick={onClose}><XIcon className="h-4 w-4" /></button>
            </div>
            <div className="flex mb-2">
                <input 
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="new tag..."
                    className="w-full border px-2 py-1 rounded-l-md text-sm"
                />
                <button onClick={handleAddTag} className="bg-gray-200 px-2 rounded-r-md"><PlusIcon className="h-5 w-5" /></button>
            </div>
            <ul className="space-y-1 max-h-40 overflow-y-auto">
                {allTags.map(tag => (
                    <li key={tag.id} className="flex justify-between items-center">
                        <span>{tag.name}</span>
                        <button onClick={() => onToggleTag(tag.name)} className="text-xl">
                           {selectedTags.includes(tag.name) ? '-' : '+'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


// Note Creation/Editing Modal
export const NoteModal: React.FC<{ isOpen: boolean; onClose: () => void; note: Note | null }> = ({ isOpen, onClose, note }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('White');
    const [priority, setPriority] = useState<Priority>('Low');
    const [tags, setTags] = useState<string[]>([]);
    const [isAssignTagModalOpen, setIsAssignTagModalOpen] = useState(false);
    
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setColor(note.color);
            setPriority(note.priority);
            setTags(note.tags);
        } else {
            setTitle('');
            setContent('');
            setColor('White');
            setPriority('Low');
            setTags([]);
        }
    }, [note, isOpen]);

    const handleToggleTag = (tagName: string) => {
        setTags(prev => prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]);
    };

    const handleAddNewTag = (tagName: string) => {
        dispatch(addTag(tagName));
        handleToggleTag(tagName);
    }
    
    const handleSubmit = () => {
        const noteData = {
            title: title || 'Untitled Note',
            content,
            color,
            priority,
            tags,
            isPinned: note?.isPinned || false,
            isArchived: false,
            isTrashed: false,
        };
        if (note) {
            dispatch(updateNote({ ...note, ...noteData }));
        } else {
            dispatch(addNote(noteData));
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} widthClass="max-w-2xl">
            <div className={`p-6 rounded-t-lg ${NOTE_COLORS[color]}`}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-xl font-semibold border-b border-gray-400 focus:outline-none focus:border-gray-700"
                />
                <textarea
                    placeholder="Take a note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent mt-4 h-48 resize-none focus:outline-none"
                />
            </div>
            <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg">
                <div className="flex items-center space-x-4 relative">
                    <button onClick={() => setIsAssignTagModalOpen(p => !p)} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">Add Tag</button>
                    {isAssignTagModalOpen && <AssignTagModal selectedTags={tags} onToggleTag={handleToggleTag} onClose={() => setIsAssignTagModalOpen(false)} onAddNewTag={handleAddNewTag} />}
                    <select value={color} onChange={(e) => setColor(e.target.value)} className="border rounded-md px-2 py-1 text-sm">
                        {Object.keys(NOTE_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="border rounded-md px-2 py-1 text-sm">
                        {NOTE_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <button onClick={handleSubmit} className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-md hover:bg-amber-500">
                    {note ? 'Save Changes' : '+ 생성하기'}
                </button>
            </div>
            <div className="bg-gray-50 px-4 pb-2 flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="bg-gray-200 text-xs px-2 py-1 rounded-full flex items-center">
                        {tag}
                        <button onClick={() => handleToggleTag(tag)} className="ml-1 font-bold text-gray-500">
                            <XIcon className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>
        </Modal>
    );
};

// Edit Tags Modal (from sidebar)
export const EditTagsModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const tags = useAppSelector(state => state.tags.tags);
    const dispatch = useAppDispatch();
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if(newTag.trim()){
            dispatch(addTag(newTag.trim()));
            setNewTag('');
        }
    };
    
    const handleDeleteTag = (tagName: string) => {
        dispatch(deleteTag(tagName));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} widthClass="max-w-sm">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Edit Tags</h3>
                    <button onClick={onClose}><XIcon className="h-5 w-5" /></button>
                </div>
                <div className="flex mb-4">
                    <input 
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="new tag..."
                        className="w-full border px-2 py-1 rounded-l-md"
                    />
                    <button onClick={handleAddTag} className="bg-gray-200 px-2 rounded-r-md"><PlusIcon className="h-5 w-5" /></button>
                </div>
                <ul className="space-y-2">
                    {tags.map(tag => (
                        <li key={tag.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                            <span>{tag.name}</span>
                            <button onClick={() => handleDeleteTag(tag.name)}><XIcon className="h-4 w-4 text-red-500"/></button>
                        </li>
                    ))}
                </ul>
            </div>
        </Modal>
    );
};

// Sort Modal
export const SortModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const sortOptions = useAppSelector(state => state.view.sortOptions);

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSortPriority(e.target.value as SortPriority));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSortDate(e.target.value as SortDate));
  };
  
  return (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-60 z-10 border">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">정렬</h4>
            <button onClick={() => {dispatch(clearSort()); onClose();}} className="text-sm text-red-500">CLEAR</button>
            <button onClick={onClose}><XIcon className="h-4 w-4" /></button>
        </div>
        <div>
            <h5 className="font-semibold text-xs uppercase text-gray-500 mb-1">PRIORITY</h5>
            <label className="flex items-center space-x-2">
                <input type="radio" name="sort" value="low-to-high" checked={sortOptions.priority === 'low-to-high'} onChange={handlePriorityChange} />
                <span>Low to High</span>
            </label>
            <label className="flex items-center space-x-2">
                <input type="radio" name="sort" value="high-to-low" checked={sortOptions.priority === 'high-to-low'} onChange={handlePriorityChange} />
                <span>High to Low</span>
            </label>
        </div>
        <div className="mt-4">
             <h5 className="font-semibold text-xs uppercase text-gray-500 mb-1">DATE</h5>
             <label className="flex items-center space-x-2">
                <input type="radio" name="sort" value="latest" checked={sortOptions.date === 'latest'} onChange={handleDateChange} />
                <span>Sort by Latest</span>
            </label>
            <label className="flex items-center space-x-2">
                <input type="radio" name="sort" value="created" checked={sortOptions.date === 'created'} onChange={handleDateChange} />
                <span>Sort by Created</span>
            </label>
            <label className="flex items-center space-x-2">
                <input type="radio" name="sort" value="edited" checked={sortOptions.date === 'edited'} onChange={handleDateChange} />
                <span>Sort by Edited</span>
            </label>
        </div>
    </div>
  )
}
