
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-64 w-full overflow-hidden p-4 bg-white">
                <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-md font-semibold text-gray-800 truncate" title={product.title}>
                    {product.title}
                </h3>
                <p className="text-lg font-bold text-primary mt-2">${product.price.toFixed(2)}</p>
                <div className="mt-auto pt-4">
                  <button
                      onClick={handleAddToCart}
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                      Add to Cart
                  </button>
                </div>
            </div>
        </div>
    </Link>
  );
};

export default ProductCard;
