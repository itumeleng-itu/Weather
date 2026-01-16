import React from "react";
import { useUnit } from "@/context/UnitContext";

export const UnitToggle: React.FC = () => {
  const { unit, toggleUnit } = useUnit();

  return (
    <button
      onClick={toggleUnit}
      className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 shadow-lg text-sm font-bold"
      aria-label={`Switch to ${unit === "celsius" ? "Fahrenheit" : "Celsius"}`}
    >
      {unit === "celsius" ? (
        <span className="text-blue-300">°C</span>
      ) : (
        <span className="text-orange-300">°F</span>
      )}
    </button>
  );
};
