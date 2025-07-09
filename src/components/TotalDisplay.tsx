import React, { useMemo } from 'react';
import { SelectedProduct } from '../types';
interface TotalDisplayProps {
  selectedProducts: SelectedProduct[];
}
const TotalDisplay: React.FC<TotalDisplayProps> = ({
  selectedProducts
}) => {
  const {
    subtotal,
    itemCount
  } = useMemo(() => {
    const subtotal = selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const itemCount = selectedProducts.reduce((count, product) => count + product.quantity, 0);
    return {
      subtotal,
      itemCount
    };
  }, [selectedProducts]);
  return <div className="bg-blue-600 text-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <span>Items:</span>
        <span>{itemCount}</span>
      </div>
      <div className="flex justify-between items-center text-xl font-bold">
        <span>Total:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md mt-4 font-medium transition-colors" onClick={() => alert('Checkout functionality would be implemented here.')}>
        Complete Sale
      </button>
    </div>;
};
export default TotalDisplay;