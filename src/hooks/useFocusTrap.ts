// useFocusTrap: Traps keyboard focus within a modal container

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Stack of open traps so nested modals only handle keys for the topmost one
const trapStack: symbol[] = [];

export function useFocusTrap(isOpen: boolean, onClose?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Keep latest onClose in a ref so callers can pass inline functions
  // without re-running the effect (which would bounce focus on every render)
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const trapId = Symbol('focus-trap');
    trapStack.push(trapId);

    // Save previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus first focusable element inside container (unless something inside already has focus)
    const container = containerRef.current;
    let frame = 0;
    if (container && !container.contains(document.activeElement)) {
      const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (firstFocusable) {
        // Delay to ensure modal is rendered
        frame = requestAnimationFrame(() => firstFocusable.focus());
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only the topmost trap responds
      if (trapStack[trapStack.length - 1] !== trapId) return;

      if (e.key === 'Escape' && onCloseRef.current) {
        onCloseRef.current();
        return;
      }

      if (e.key !== 'Tab') return;

      const el = containerRef.current;
      if (!el) return;

      const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      const index = trapStack.indexOf(trapId);
      if (index !== -1) trapStack.splice(index, 1);

      // Restore focus to previously focused element
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  return containerRef;
}
