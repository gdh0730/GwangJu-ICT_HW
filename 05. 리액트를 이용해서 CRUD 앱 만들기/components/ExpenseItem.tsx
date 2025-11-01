
import React from 'react';
import { Expense } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface ExpenseItemProps {
    expense: Expense;
    handleDelete: (id: string) => void;
    handleEdit: (id: string) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, handleDelete, handleEdit }) => {
    const { id, name, amount } = expense;

    return (
        <li className="flex justify-between items-center p-4 border-b border-gray-200">
            <div className="flex-1">
                <span className="text-gray-800">{name}</span>
            </div>
            <div className="flex-1 text-right">
                <span className="text-gray-800 font-semibold">{amount.toLocaleString()}</span>
            </div>
            <div className="ml-4 flex items-center space-x-2">
                <button onClick={() => handleEdit(id)} aria-label={`Edit ${name}`}>
                    <EditIcon />
                </button>
                <button onClick={() => handleDelete(id)} aria-label={`Delete ${name}`}>
                    <DeleteIcon />
                </button>
            </div>
        </li>
    );
};

export default ExpenseItem;
