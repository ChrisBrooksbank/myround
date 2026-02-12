// Header component with navigation and round count badge

import { Link, useLocation } from 'react-router-dom';
import { useRound } from '../hooks/useRound';

export function Header() {
  const { round } = useRound();
  const location = useLocation();

  const orderCount = round.orders.length;

  return (
    <header className="header">
      <nav className="nav">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Order
        </Link>
        <Link
          to="/summary"
          className={`nav-link ${location.pathname === '/summary' ? 'active' : ''}`}
        >
          Summary
          {orderCount > 0 && (
            <span className="round-badge">{orderCount}</span>
          )}
        </Link>
        <Link
          to="/regulars"
          className={`nav-link ${location.pathname === '/regulars' ? 'active' : ''}`}
        >
          Regulars
        </Link>
      </nav>
    </header>
  );
}
