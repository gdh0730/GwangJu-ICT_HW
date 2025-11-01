
import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../hooks/useCart';

const CartPage: React.FC = () => {
  const { state } = useCart();
  const { items } = state;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
         <div className="w-16 h-16 mx-auto text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-6 border-b pb-4">Shopping Cart</h1>
      <div>
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-sm">
            <div className="flex justify-between text-lg font-semibold text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">Shipping and taxes calculated at checkout.</p>
            <button className="w-full bg-primary text-white py-3 mt-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Proceed to Checkout
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
