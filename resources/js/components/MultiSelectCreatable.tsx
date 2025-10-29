import React, { useMemo, useEffect } from "react";
import { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { cn } from "@/lib/utils";

interface OptionType {
  value: string;
  label: string;
}

interface MultiSelectCreatableProps {
  name: string;
  label?: string;
  className?: string;
  placeholder?: string;
  description?: string;
  /** Tableau des options disponibles */
  options?: OptionType[];
  /** Valeur actuelle du champ (vient de field.value) */
  value?: string[];
  /** Callback lors du changement (vient de field.onChange) */
  onChange?: (value: string[]) => void;
}

const MultiSelectCreatable: React.FC<MultiSelectCreatableProps> = ({
  label,
  className,
  placeholder = "Sélectionner ou créer des éléments...",
  description,
  options: initialOptions = [],
  value = [],
  onChange,
}) => {
  const [internalOptions, setInternalOptions] = React.useState<OptionType[]>(initialOptions);

  // Synchroniser les options internes avec les options initiales et les valeurs sélectionnées
  useEffect(() => {
    const allOptions = [...initialOptions];
    const existingValues = new Set(initialOptions.map(opt => opt.value));
    
    // Ajouter les valeurs sélectionnées qui ne sont pas déjà dans les options
    if (value && value.length > 0) {
      value.forEach(val => {
        if (val && !existingValues.has(val)) {
          allOptions.push({ value: val, label: val });
          existingValues.add(val);
        }
      });
    }
    
    setInternalOptions(allOptions);
  }, [initialOptions, value]);

  // Convertir les valeurs sélectionnées en format attendu par react-select
  const selectedOptions = useMemo(() => {
    if (!value || value.length === 0) return [];
    
    return value
      .map(val => {
        const option = internalOptions.find(opt => opt.value === val);
        return option || { value: val, label: val };
      })
      .filter(Boolean) as OptionType[];
  }, [value, internalOptions]);


  // Gestion du changement de sélection
  const handleChange = (newValue: MultiValue<OptionType>) => {
    const values = newValue ? newValue.map((item: OptionType) => item.value) : [];
    onChange?.(values);
  };

  // Gestion de la création d'une nouvelle option
  const handleCreate = (inputValue: string) => {
    if (!inputValue.trim()) return;
    
    const trimmedValue = inputValue.trim();
    const newOption = {
      label: trimmedValue,
      value: trimmedValue,
    };

    // Ajouter la nouvelle option à la liste des options
    setInternalOptions(prev => [...prev, newOption]);

    // Mettre à jour la valeur sélectionnée
    const currentValues = value || [];
    onChange?.([...currentValues, newOption.value]);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
          {label}
        </label>
      )}
      <CreatableSelect
        isMulti
        isClearable
        classNamePrefix="select"
        placeholder={placeholder}
        options={internalOptions}
        value={selectedOptions}
        onChange={handleChange}
        onCreateOption={handleCreate}
        className="text-foreground"
        classNames={{
          control: (state) =>
            `min-h-10 border-input ${state.isFocused ? 'ring-2 ring-ring ring-offset-2' : ''}`,
          multiValue: () => 'bg-muted',
          multiValueLabel: () => 'text-foreground',
        }}
        noOptionsMessage={() => "Tapez pour créer un nouvel élément"}
        formatCreateLabel={(inputValue) => `Créer "${inputValue}"`}
      />
      {description && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
};

export default MultiSelectCreatable;