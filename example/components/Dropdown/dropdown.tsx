import React from 'react';

interface DropdownOption {
  label: string;
  value: number;
}

interface DropdownProps {
  options: DropdownOption[];
  onSelect: (selected: number) => void;
  defaultValue: string | number;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, defaultValue }) => {
  return (
    <select defaultValue={defaultValue} onChange={(e) => onSelect(Number(e.target.value))}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;