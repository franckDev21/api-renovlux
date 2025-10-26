import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface ServicesFiltersProps {
  search: string;
  isActive: boolean | null;
  onSearchChange: (search: string) => void;
  onIsActiveChange: (isActive: boolean | null) => void;
}

export function ServicesFilters({
  search,
  isActive,
  onSearchChange,
  onIsActiveChange,
}: ServicesFiltersProps) {
  const hasFilters = search || isActive !== null;

  const handleReset = () => {
    onSearchChange('');
    onIsActiveChange(null);
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un service..."
          className="w-full pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant={isActive === true ? 'default' : 'outline'}
          onClick={() => onIsActiveChange(isActive === true ? null : true)}
        >
          Actifs
        </Button>
        <Button
          variant={isActive === false ? 'default' : 'outline'}
          onClick={() => onIsActiveChange(isActive === false ? null : false)}
        >
          Inactifs
        </Button>
        {hasFilters && (
          <Button variant="ghost" onClick={handleReset}>
            Réinitialiser
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
