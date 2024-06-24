import { createContext, useState, Dispatch, ReactNode, useContext } from "react";

// Define a type for the context value
type LanguageContextType = {
  language: string;
  setLanguage: Dispatch<string>;
};

// Create a Context object with initial default values
export const LanguageContext = createContext<LanguageContextType>({
  language: "english",
  setLanguage: () => {},
});

// Define props interface for LanguageProvider
type LanguageProviderProps = {
  children: ReactNode;
};

// Create a Provider component
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>("hindi"); // Default language is Hindi

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguageContext = () => useContext(LanguageContext)