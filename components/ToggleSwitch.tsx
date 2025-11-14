
import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
  return (
    <label htmlFor="toggle-switch" className="flex items-center cursor-pointer">
      <span className="mr-3 text-sm font-medium text-gray-300">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          id="toggle-switch"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
            checked ? 'transform translate-x-6 bg-cyan-400' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};
