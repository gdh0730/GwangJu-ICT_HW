
import React from 'react';
import { SubmitIcon } from './icons';

interface ExpenseFormProps {
    name: string;
    amount: string;
    handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditing: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
    name,
    amount,
    handleNameChange,
    handleAmountChange,
    handleSubmit,
    isEditing,
}) => {
    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">지출 항목</label>
                    <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="예) 렌트비"
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-500 mb-1">비용</label>
                    <input
                        type="number"
                        id="amount"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="0"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </div>
            </div>
            <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                {isEditing ? '수정' : '제출'}
                <SubmitIcon />
            </button>
        </form>
    );
};

export default ExpenseForm;
