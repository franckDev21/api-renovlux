import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { MultiValue } from "react-select"

interface Option {
  label: string;
  value: string;
}

interface MultiSelectCreatableTestProps {
  /** Toutes les options disponibles */
  data: Option[];
  /** Valeurs sélectionnées par défaut (ex: ['apple', 'banana']) */
  defaultSelectedValues?: string[];
  /** Callback appelé à chaque changement de sélection */
  onChange?: (values: Option[]) => void;
  /** Placeholder affiché dans le champ */
  placeholder?: string;
}

const MultiSelectCreatableTest: React.FC<MultiSelectCreatableTestProps> = ({
  data,
  defaultSelectedValues = [],
  onChange,
  placeholder = "Sélectionner ou créer une option...",
}) => {
  const [options, setOptions] = useState<Option[]>(data);
  const [selected, setSelected] = useState<MultiValue<Option>>([]);

  // ✅ Initialise les valeurs sélectionnées par défaut
  useEffect(() => {
    const defaults = data.filter((opt) =>
      defaultSelectedValues.includes(opt.value)
    );
    setSelected(defaults);
  }, [data, defaultSelectedValues]);

  // ✅ Gestion du changement
  const handleChange = (newValue: MultiValue<Option>) => {
    setSelected(newValue);
    onChange?.(newValue as Option[]);
  };

  // ✅ Gestion de la création d'une nouvelle option
  const handleCreate = (inputValue: string) => {
    const newOption: Option = {
      label: inputValue,
      value: inputValue.toLowerCase().trim(),
    };

    const updatedOptions = [...options, newOption];
    const updatedSelected = [...(selected as Option[]), newOption];

    setOptions(updatedOptions);
    setSelected(updatedSelected);
    onChange?.(updatedSelected);
  };

  return (
    <CreatableSelect
      isMulti
      options={options}
      value={selected}
      onChange={handleChange}
      onCreateOption={handleCreate}
      placeholder={placeholder}
      className="w-full"
    />
  );
};

export default MultiSelectCreatableTest;
