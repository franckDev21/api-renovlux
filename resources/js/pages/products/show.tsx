import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProduct } from '@/features/products/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

interface ShowProps {
  id: string;
}

export default function Show({ id }: ShowProps) {
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
      title: product?.name || 'Détails du produit',
    },
  ];

  if (isLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Détails du produit" />
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
    },
  ];

  return (
    <AppLayout breadcrumbs={finalBreadcrumbs}>
      <Head title={`${product.name} - Détails`} />
      
      <div className="flex flex-col space-y-6 px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.visit('/products/home')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-muted-foreground">
                Détails du produit
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/products/${product.id}/edit`} prefetch>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Image principale</CardTitle>
            </CardHeader>
            <CardContent>
              {product.image_principale ? (
                <img
                  src={product.image_principale}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-muted rounded-md text-muted-foreground">
                  Aucune image
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p className="text-lg">{product.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prix</p>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(product.price)}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock</p>
                <Badge variant={product.en_stock ? "default" : "destructive"} className="mt-1">
                  {product.en_stock ? "En stock" : "Rupture"}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Statut</p>
                <Badge variant={product.active ? "default" : "secondary"} className="mt-1">
                  {product.active ? "Actif" : "Inactif"}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                <p className="text-sm">
                  {new Date(product.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {product.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{product.description}</p>
            </CardContent>
          </Card>
        )}

        {product.images_secondaires && product.images_secondaires.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Images secondaires</CardTitle>
              <CardDescription>
                {product.images_secondaires.length} image(s) supplémentaire(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.images_secondaires.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {product.created_by && (
          <Card>
            <CardHeader>
              <CardTitle>Créé par</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p>{product.created_by.name}</p>
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{product.created_by.email}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

