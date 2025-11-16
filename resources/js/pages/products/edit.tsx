import { ProductNewForm } from '@/features/products/components/ProductNewForm';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useProduct } from '@/features/products/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

interface EditProps {
  id: string;
}

export default function Edit({ id }: EditProps) {
  const { data: product, isLoading, error } = useProduct(id);

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
      title: product?.name || 'Modification',
      href: product ? `/products/${product.id}` : undefined,
    },
    {
      title: "Modification",
    },
  ];

  if (isLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Modification du produit" />
        <div className="flex flex-col space-y-6 px-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !product) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Erreur" />
        <div className="flex flex-col space-y-6 px-6">
          <div className="text-center text-destructive">
            Erreur lors du chargement du produit. Veuillez réessayer.
          </div>
        </div>
      </AppLayout>
    );
  }

  const finalBreadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Tableau de bord',
      href: dashboard().url,
    },
    {
      title: 'Produits',
      href: '/products/home'
    },
    {
      title: product.name,
      href: `/products/${product.id}`,
    },
    {
      title: "Modification",
    },
  ];

  return (
    <AppLayout breadcrumbs={finalBreadcrumbs}>
      <Head title={`Modification - ${product.name}`} />
      
      <div className="flex flex-col space-y-6 px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Modification du produit</h1>
            <p className="text-muted-foreground">
              Modifiez les informations du produit {product.name}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <ProductNewForm product={product} />
        </div>
      </div>
     
    </AppLayout>
  );
}

