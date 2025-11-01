
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setActiveView } from '../store/viewSlice';
import { ActiveView, Tag } from '../types';
import { NoteIcon, ArchiveIcon, TrashIcon, TagIcon, EditIcon } from './Icons';

interface SidebarProps {
  onEditTags: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onEditTags }) => {
  const tags = useAppSelector((state) => state.tags.tags);
  const activeView = useAppSelector((state) => state.view.activeView);
  const dispatch = useAppDispatch();

  const NavItem: React.FC<{
    viewName: ActiveView;
    label: string;
    icon: React.ReactNode;
  }> = ({ viewName, label, icon }) => {
    const isActive = activeView === viewName;
    return (
      <li
        onClick={() => dispatch(setActiveView(viewName))}
        className={`flex items-center space-x-4 px-4 py-2 rounded-r-full cursor-pointer transition-colors duration-200 ${
          isActive
            ? 'bg-yellow-200 font-semibold'
            : 'hover:bg-gray-200'
        }`}
      >
        {icon}
        <span>{label}</span>
      </li>
    );
  };

  return (
    <aside className="w-64 bg-amber-100 p-4 pt-8 flex flex-col space-y-2 text-gray-700">
      <h1 className="text-2xl font-bold px-4 mb-6">keep</h1>
      <ul className="space-y-1">
        <NavItem viewName="notes" label="Notes" icon={<NoteIcon className="h-5 w-5" />} />
        {tags.map((tag) => (
          <NavItem
            key={tag.id}
            viewName={tag.name}
            label={tag.name}
            icon={<TagIcon className="h-5 w-5" />}
          />
        ))}
        <li
            onClick={onEditTags}
            className="flex items-center space-x-4 px-4 py-2 rounded-r-full cursor-pointer hover:bg-gray-200"
        >
            <EditIcon className="h-5 w-5" />
            <span>Edit Notes</span>
        </li>
        <NavItem viewName="archive" label="Archive" icon={<ArchiveIcon className="h-5 w-5" />} />
        <NavItem viewName="trash" label="Trash" icon={<TrashIcon className="h-5 w-5" />} />
      </ul>
    </aside>
  );
};

export default Sidebar;
