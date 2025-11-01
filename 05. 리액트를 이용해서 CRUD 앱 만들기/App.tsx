
import React, { useState, useEffect } from 'react';
import { Expense, AlertState } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';

const getInitialExpenses = (): Expense[] => {
    try {
        const storedExpenses = localStorage.getItem('expenses');
        return storedExpenses ? JSON.parse(storedExpenses) : [];
    } catch (error) {
        console.error("Failed to parse expenses from localStorage", error);
        return [];
    }
};

const App: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>(getInitialExpenses());
    const [name, setName] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [alert, setAlert] = useState<AlertState>({ show: false, text: '', type: 'success' });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    const showAlert = (text: string, type: 'success' | 'danger') => {
        setAlert({ show: true, text, type });
        setTimeout(() => {
            setAlert({ show: false, text: '', type: 'success' });
        }, 3000);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const clearForm = () => {
        setName('');
        setAmount('');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name && amount && parseFloat(amount) > 0) {
            const expenseAmount = parseFloat(amount);
            if (isEditing && editId) {
                setExpenses(
                    expenses.map((item) =>
                        item.id === editId ? { ...item, name, amount: expenseAmount } : item
                    )
                );
                showAlert('아이템이 수정되었습니다.', 'success');
                setIsEditing(false);
                setEditId(null);
            } else {
                const newExpense: Expense = {
                    id: crypto.randomUUID(),
                    name,
                    amount: expenseAmount,
                };
                setExpenses([...expenses, newExpense]);
                showAlert('아이템이 생성되었습니다.', 'success');
            }
            clearForm();
        } else {
            showAlert('유효한 값을 입력해주세요.', 'danger');
        }
    };

    const handleClear = () => {
        setExpenses([]);
        showAlert('모든 목록을 지웠습니다.', 'danger');
    };

    const handleDelete = (id: string) => {
        setExpenses(expenses.filter((item) => item.id !== id));
        showAlert('아이템을 삭제했습니다.', 'danger');
    };

    const handleEdit = (id: string) => {
        const expenseToEdit = expenses.find((item) => item.id === id);
        if (expenseToEdit) {
            setIsEditing(true);
            setEditId(id);
            setName(expenseToEdit.name);
            setAmount(String(expenseToEdit.amount));
        }
    };
    
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="bg-[#d2b48c] min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                {alert.show && <Alert alert={alert} />}
                <main className="bg-white p-6 sm:p-8 mt-4 rounded-lg shadow-2xl">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        예산 계산기
                    </h1>
                    <ExpenseForm
                        name={name}
                        amount={amount}
                        handleNameChange={handleNameChange}
                        handleAmountChange={handleAmountChange}
                        handleSubmit={handleSubmit}
                        isEditing={isEditing}
                    />
                    <ExpenseList
                        expenses={expenses}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        handleClear={handleClear}
                    />
                </main>
                 {totalExpenses > 0 && (
                    <div className="mt-6 text-right w-full">
                        <h2 className="text-2xl font-bold text-gray-800">
                            총지출: {totalExpenses.toLocaleString()}원
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
