import React, { createContext, useContext, useState, useEffect } from "react";

type Unit = "celsius" | "fahrenheit";

interface UnitContextType {
  unit: Unit;
  toggleUnit: () => void;
  formatTemp: (celsius: number) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unit, setUnit] = useState<Unit>(() => {
    const saved = localStorage.getItem("weather-unit");
    return (saved as Unit) || "celsius";
  });

  useEffect(() => {
    localStorage.setItem("weather-unit", unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "celsius" ? "fahrenheit" : "celsius"));
  };

  const formatTemp = (celsius: number): string => {
    if (unit === "fahrenheit") {
      return `${Math.round(celsius * (9 / 5) + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit, formatTemp }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
};
