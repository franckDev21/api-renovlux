import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServices } from '@/features/services/hooks/useServices';
import {
  ServiceFormDialog,
  DeleteConfirmation,
  ServicesList,
  ServicesFilters,
  ServicesPagination,
} from '@/features/services/components';
import { Service } from '@/features/services/types/service';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tableau de bord',
    href: dashboard().url,
  },
  {
    title: 'Services',
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | null>(true);
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch services using React Query
  const { data, isLoading } = useServices({
    search,
    is_active: isActive,
    page,
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleDeleteSuccess = () => {
    setDeleteId(null);
  };
  

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion des services" />
      
      <div className="flex flex-col space-y-6 px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des services</h1>
            <p className="text-muted-foreground">
              Gérez les services proposés par votre entreprise
            </p>
          </div>
          <Button asChild >
            <Link href="/company-services/create" prefetch>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un service
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-4">
            <ServicesFilters
              search={search}
              isActive={isActive}
              onSearchChange={setSearch}
              onIsActiveChange={setIsActive}
            />
          </div>

          <div className="border-t">
            <ServicesList
              services={data?.data || []}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={setDeleteId}
            />
            
            <ServicesPagination
              currentPage={page}
              totalPages={data?.meta?.last_page || 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      <ServiceFormDialog
        isOpen={isFormOpen}
        service={editingService}
        onClose={() => {
          setIsFormOpen(false);
          setEditingService(null);
        }}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmation
        isOpen={!!deleteId}
        serviceId={deleteId}
        onClose={() => setDeleteId(null)}
        onSuccess={handleDeleteSuccess}
      />
    </AppLayout>
  );
}
