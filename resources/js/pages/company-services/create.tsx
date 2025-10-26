// import { ServiceForm } from '@/features/services/components';
import { ServiceNewForm } from '@/features/services/components/ServiceNewForm';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// import { Service } from '@/features/services/types/service';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tableau de bord',
    href: dashboard().url,
  },
  {
    title: 'Services',
    href: '/company-services/home'
  },
  {
    title: "Creation d'un nouveau service", 
  },
];

export default function Home() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Creation des services" />
      
      <div className="flex flex-col space-y-6 px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Creation d'un services</h1>
            <p className="text-muted-foreground">
              Gérez les services proposés par votre entreprise
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          {/* <ServiceForm onCancel={() => {}}  onSuccess={() => {}} /> */}
          <ServiceNewForm />
        </div>
      </div>
     
    </AppLayout>
  );
}
