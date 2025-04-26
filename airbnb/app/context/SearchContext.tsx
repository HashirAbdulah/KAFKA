// @/app/context/SearchContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SearchContextProps {
  filters: { [key: string]: any };
  setFilters: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <SearchContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
