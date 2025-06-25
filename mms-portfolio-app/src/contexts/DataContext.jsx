import { createContext, useContext, useState, useEffect } from "react";
import portfolioData from "../data/portfolioData.json";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(portfolioData);

  const updateData = (section, newData) => {
    setData((prev) => ({
      ...prev,
      [section]: newData,
    }));
  };

  const addItem = (section, item) => {
    setData((prev) => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? [...prev[section], { ...item, id: Date.now() }]
        : { ...prev[section], ...item },
    }));
  };

  const removeItem = (section, id) => {
    setData((prev) => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? prev[section].filter((item) => item.id !== id)
        : prev[section],
    }));
  };

  const value = {
    data,
    updateData,
    addItem,
    removeItem,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
