
import React from 'react';
import { Expense } from '../types';
import ExpenseItem from './ExpenseItem';
import { ClearIcon } from './icons';

interface ExpenseListProps {
    expenses: Expense[];
    handleDelete: (id: string) => void;
    handleEdit: (id: string) => void;
    handleClear: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, handleDelete, handleEdit, handleClear }) => {
    return (
        <div>
            <ul>
                {expenses.map((expense) => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                    />
                ))}
            </ul>
            {expenses.length > 0 && (
                <div className="mt-4">
                    <button
                        onClick={handleClear}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        목록 지우기
                        <ClearIcon />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
