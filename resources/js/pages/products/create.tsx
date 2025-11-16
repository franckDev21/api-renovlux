import { ProductNewForm } from '@/features/products/components/ProductNewForm';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tableau de bord',
    href: dashboard().url,
  },
  {
    title: 'Produits',
    href: '/products/home'
  },
  {
    title: "Création d'un nouveau produit", 
  },
];

export default function Create() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Création d'un produit" />
      
      <div className="flex flex-col space-y-6 px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Création d'un produit</h1>
            <p className="text-muted-foreground">
              Ajoutez un nouveau produit à votre catalogue
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <ProductNewForm />
        </div>
      </div>
     
    </AppLayout>
  );
}

