
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../hooks/useCart';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
        dispatch({ type: 'ADD_ITEM', payload: product });
    }
  };

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center">Product not found.</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center bg-white p-4 rounded-lg">
          <img src={product.image} alt={product.title} className="max-h-96 object-contain" />
        </div>
        <div>
          <p className="text-gray-500 text-sm capitalize mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-primary mb-4">{product.title}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
                {[...Array(Math.round(product.rating.rate))].map((_, i) => '★')}
                {[...Array(5-Math.round(product.rating.rate))].map((_, i) => '☆')}
            </div>
            <span className="text-gray-600 ml-2">({product.rating.count} reviews)</span>
          </div>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-4xl font-extrabold text-primary">${product.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              className="bg-primary text-white py-3 px-8 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
