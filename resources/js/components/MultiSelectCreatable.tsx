import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { cn } from "@/lib/utils";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
}

const MultiSelectCreatable: React.FC<MultiSelectCreatableProps> = ({
  name,
  label,
  className,
  placeholder = "Sélectionner ou créer des éléments...",
  description,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedOptions = Array.isArray(field.value)
          ? field.value.map((item: string) => ({
              value: item,
              label: item,
            }))
          : [];

        return (
          <FormItem className={cn("w-full", className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <CreatableSelect
                isMulti
                isClearable
                classNamePrefix="select"
                placeholder={placeholder}
                value={selectedOptions}
                onChange={(newValue) => {
                  field.onChange(newValue.map((item: OptionType) => item.value));
                }}
                onCreateOption={(inputValue) => {
                  const newValue = [...(field.value || []), inputValue];
                  field.onChange(newValue);
                }}
                options={[]}
                className="text-foreground"
                classNames={{
                  control: (state) =>
                    `min-h-10 border-input ${state.isFocused ? 'ring-2 ring-ring ring-offset-2' : ''}`,
                  multiValue: () => 'bg-muted',
                  multiValueLabel: () => 'text-foreground',
                }}
                noOptionsMessage={() => "Tapez pour créer un nouvel élément"}
              />
            </FormControl>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <FormMessage>{error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};

export default MultiSelectCreatable;
