import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Service } from '../types/service';

interface ServicesListProps {
  services: Service[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export function ServicesList({ services, isLoading, onEdit, onDelete }: ServicesListProps) {
  console.log('ServicesList - services:', services);
  console.log('ServicesList - isLoading:', isLoading);
  console.log('ServicesList - services type:', typeof services);
  console.log('ServicesList - services length:', services?.length);

  if (isLoading) {
    return (
      <div className="p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mb-4 flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Aucun service trouvé.</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Prix</TableHead>
          <TableHead>Durée</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>
              <div className="w-12 h-12 rounded-md overflow-hidden">
                <ImageWithFallback
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{service.name}</TableCell>
            <TableCell className="max-w-xs truncate">{service.description}</TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              }).format(service.price)}
            </TableCell>
            <TableCell>{service.duration}</TableCell>
            <TableCell>
              <Badge variant={service.is_active ? 'default' : 'secondary'}>
                {service.is_active ? 'Actif' : 'Inactif'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(service)}
                  title="Modifier"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(service.id)}
                  className="text-destructive hover:text-destructive/90"
                  title="Supprimer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
