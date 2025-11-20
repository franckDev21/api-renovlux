import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ProjectForm } from '@/features/projects/components/ProjectForm';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tableau de bord',
    href: dashboard().url,
  },
  {
    title: 'Projets',
    href: '/projects/home'
  },
  {
    title: 'Création',
  },
];

export default function Create() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Création d'un projet" />

      <div className="flex flex-col space-y-6 px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Créer un projet</h1>
          <p className="text-muted-foreground">Renseignez les informations du projet</p>
        </div>

        <div className="rounded-lg border bg-card">
          <ProjectForm />
        </div>
      </div>
    </AppLayout>
  );
}
