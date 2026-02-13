// OrderItem component with person name, drink, quantity controls, and delete button

import type { OrderLine } from '../types';
import { getDrinkById } from '../data/drinks';
import { haptic } from '../lib/haptics';

interface OrderItemProps {
  order: OrderLine;
  onUpdateQuantity: (orderId: string, quantity: number) => void;
  onRemove: (orderId: string) => void;
}

export function OrderItem({ order, onUpdateQuantity, onRemove }: OrderItemProps) {
  const drink = getDrinkById(order.drinkId);
  const drinkName = order.customDrinkName || drink?.name || 'Unknown';

  const handleIncrement = () => {
    haptic();
    onUpdateQuantity(order.id, order.quantity + 1);
  };

  const handleDecrement = () => {
    haptic();
    onUpdateQuantity(order.id, order.quantity - 1);
  };

  const handleRemove = () => {
    haptic();
    onRemove(order.id);
  };

  return (
    <div className="order-item">
      <div className="order-item-info">
        <span className="order-item-person">{order.personName}</span>
        <span className="order-item-drink">{drinkName}</span>
      </div>
      <div className="order-item-controls">
        <div className="quantity-controls">
          <button
            className="quantity-button"
            onClick={handleDecrement}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="quantity-display">{order.quantity}</span>
          <button
            className="quantity-button"
            onClick={handleIncrement}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          className="delete-button"
          onClick={handleRemove}
          aria-label="Remove order"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
