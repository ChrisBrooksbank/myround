// Header component with navigation and round count badge

import { Link, useLocation } from 'react-router-dom';
import { useRound } from '../hooks/useRound';

export function Header() {
  const { round } = useRound();
  const location = useLocation();

  const orderCount = round.orders.reduce((sum, o) => sum + o.quantity, 0);

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
        <Link
          to="/history"
          className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
        >
          History
        </Link>
        <Link
          to="/settings"
          className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
          aria-label="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="10" r="3" />
            <path d="M10 1.5v2M10 16.5v2M3.4 3.4l1.4 1.4M15.2 15.2l1.4 1.4M1.5 10h2M16.5 10h2M3.4 16.6l1.4-1.4M15.2 4.8l1.4-1.4" />
          </svg>
        </Link>
      </nav>
    </header>
  );
}
