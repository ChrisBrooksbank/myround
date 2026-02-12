// OrderList component rendering all current order items

import type { OrderLine } from '../types';
import { OrderItem } from './OrderItem';

interface OrderListProps {
  orders: OrderLine[];
  onUpdateQuantity: (orderId: string, quantity: number) => void;
  onRemove: (orderId: string) => void;
}

export function OrderList({ orders, onUpdateQuantity, onRemove }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="order-list-empty" aria-live="polite" aria-relevant="additions removals">
        Tap a drink to start the round
      </div>
    );
  }

  return (
    <div className="order-list" aria-live="polite" aria-relevant="additions removals">
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          order={order}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
