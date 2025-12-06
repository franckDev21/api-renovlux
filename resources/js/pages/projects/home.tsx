import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ListingProject from '@/features/projects/components/ListingProject';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tableau de bord',
    href: dashboard().url,
  },
  {
    title: 'Projets',
  },
];

export default function Home() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion des projets" />

      <div className="flex flex-col space-y-6 px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des projets</h1>
            <p className="text-muted-foreground">
              Gérez les projets de votre catalogue
            </p>
          </div>
          <Button asChild>
            <Link href="/projects/create" prefetch>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un projet
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <ListingProject />
        </div>
      </div>
    </AppLayout>
  );
}
