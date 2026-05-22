import React, { createContext, useState, ReactNode } from 'react';

interface FacultyContextValue {
  activeFacultyId: string | null;
  setActiveFacultyId: (id: string | null) => void;
}

export const FacultyContext = createContext<FacultyContextValue | undefined>(undefined);

interface FacultyContextProviderProps {
  children: ReactNode;
}

export const FacultyContextProvider: React.FC<FacultyContextProviderProps> = ({ children }) => {
  const [activeFacultyId, setActiveFacultyId] = useState<string | null>(null);

  const value: FacultyContextValue = {
    activeFacultyId,
    setActiveFacultyId,
  };

  return (
    <FacultyContext.Provider value={value}>
      {children}
    </FacultyContext.Provider>
  );
};

export const useFacultyContext = () => {
  const context = React.useContext(FacultyContext);
  if (context === undefined) {
    throw new Error('useFacultyContext must be used within a FacultyContextProvider');
  }
  return context;
};
