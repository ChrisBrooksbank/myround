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
    return null;
  }

  return (
    <div className="order-list">
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
