// Regulars and groups state management hook with persistence

import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Regular, RegularGroup } from '../types';
import { getRegulars, saveRegulars, getGroups, saveGroups } from '../lib/storage';

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface RegularsContextValue {
  regulars: Regular[];
  groups: RegularGroup[];
  addRegular: (name: string, favouriteDrinkIds: string[]) => void;
  updateRegular: (id: string, name: string, favouriteDrinkIds: string[]) => void;
  deleteRegular: (id: string) => void;
  addGroup: (name: string, memberIds: string[]) => void;
  updateGroup: (id: string, name: string, memberIds: string[]) => void;
  deleteGroup: (id: string) => void;
}

const RegularsContext = createContext<RegularsContextValue | null>(null);

export function RegularsProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const [regulars, setRegulars] = useState<Regular[]>(() => getRegulars());
  const [groups, setGroups] = useState<RegularGroup[]>(() => getGroups());

  // Persist regulars to localStorage whenever they change
  useEffect(() => {
    saveRegulars(regulars);
  }, [regulars]);

  // Persist groups to localStorage whenever they change
  useEffect(() => {
    saveGroups(groups);
  }, [groups]);

  // Add a new regular
  const addRegular = (name: string, favouriteDrinkIds: string[]) => {
    const newRegular: Regular = {
      id: generateId(),
      name,
      favouriteDrinkIds,
    };
    setRegulars(prev => [...prev, newRegular]);
  };

  // Update an existing regular
  const updateRegular = (id: string, name: string, favouriteDrinkIds: string[]) => {
    setRegulars(prev =>
      prev.map(regular =>
        regular.id === id ? { ...regular, name, favouriteDrinkIds } : regular
      )
    );
  };

  // Delete a regular
  const deleteRegular = (id: string) => {
    setRegulars(prev => prev.filter(regular => regular.id !== id));

    // Also remove this regular from any groups
    setGroups(prev =>
      prev.map(group => ({
        ...group,
        memberIds: group.memberIds.filter(memberId => memberId !== id),
      }))
    );
  };

  // Add a new group
  const addGroup = (name: string, memberIds: string[]) => {
    const newGroup: RegularGroup = {
      id: generateId(),
      name,
      memberIds,
    };
    setGroups(prev => [...prev, newGroup]);
  };

  // Update an existing group
  const updateGroup = (id: string, name: string, memberIds: string[]) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === id ? { ...group, name, memberIds } : group
      )
    );
  };

  // Delete a group
  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(group => group.id !== id));
  };

  const value: RegularsContextValue = {
    regulars,
    groups,
    addRegular,
    updateRegular,
    deleteRegular,
    addGroup,
    updateGroup,
    deleteGroup,
  };

  return <RegularsContext.Provider value={value}>{children}</RegularsContext.Provider>;
}

// Hook to use regulars context
export function useRegulars(): RegularsContextValue {
  const context = useContext(RegularsContext);
  if (!context) {
    throw new Error('useRegulars must be used within a RegularsProvider');
  }
  return context;
}
