import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

interface Option {
  label: string;
  value: string;
}

const MultiSelectCreatable = () => {
  const [options, setOptions] = useState<Option[]>([
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ]);
  const [selected, setSelected] = useState<Option[]>([]);

  const handleChange = (newValue: unknown) => {
    setSelected(newValue as Option[]);
  };

  const handleCreate = (inputValue: string) => {
    const newOption = { label: inputValue, value: inputValue.toLowerCase() };
    setOptions((prev) => [...prev, newOption]);
    setSelected((prev) => [...prev, newOption]);
  };

  return (
    <CreatableSelect
      isMulti
      options={options}
      value={selected}
      onChange={handleChange}
      onCreateOption={handleCreate}
      placeholder="Sélectionner ou créer une option..."
    />
  );
};

export default MultiSelectCreatable;
