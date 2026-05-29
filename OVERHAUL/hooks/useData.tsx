
import { createContext, useContext, useState, ReactNode } from "react";

interface DataContextType {
  content: string;
  setContent: (content: string) => void;
}

export const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState('');

  return (
    <DataContext.Provider value={{ content, setContent }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}