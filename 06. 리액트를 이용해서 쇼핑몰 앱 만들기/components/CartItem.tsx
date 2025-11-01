
import React from 'react';
import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '../types';
import { useCart } from '../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: newQuantity } });
  };

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-24 h-24 mr-4 flex-shrink-0">
        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
      </div>
      <div className="flex-grow">
        <Link to={`/product/${item.id}`} className="font-semibold text-gray-800 hover:text-accent">
          {item.title}
        </Link>
        <p className="text-sm text-gray-500 capitalize">{item.category}</p>
        <div className="flex items-center mt-2 space-x-2">
            <button onClick={() => handleQuantityChange(item.quantity - 1)} className="px-2 py-1 border rounded">-</button>
            <span>{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className="font-bold text-lg text-primary">${(item.price * item.quantity).toFixed(2)}</p>
        <button onClick={handleRemove} className="text-red-500 hover:text-red-700 mt-2">
            <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
