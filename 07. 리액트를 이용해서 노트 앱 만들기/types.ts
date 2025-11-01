
export type Priority = 'Low' | 'High';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  priority: Priority;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export type SortPriority = 'low-to-high' | 'high-to-low' | '';
export type SortDate = 'latest' | 'created' | 'edited' | '';

export interface SortOptions {
  priority: SortPriority;
  date: SortDate;
}

export type ActiveView = 'notes' | 'archive' | 'trash' | string; // string is for tag name
