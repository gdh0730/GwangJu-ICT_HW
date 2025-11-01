
import React from 'react';
import { AlertState } from '../types';

interface AlertProps {
    alert: AlertState;
}

const Alert: React.FC<AlertProps> = ({ alert }) => {
    const { type, text } = alert;
    const alertClass = type === 'success' 
        ? 'bg-green-500' 
        : 'bg-red-500';

    return (
        <div className={`text-white text-center p-2 rounded-md transition-opacity duration-300 ${alertClass}`}>
            {text}
        </div>
    );
};

export default Alert;
