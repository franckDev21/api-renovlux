import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useProject } from '@/features/projects/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectForm } from '@/features/projects/components/ProjectForm';

interface EditProps {
  id: string;
}

export default function Edit({ id }: EditProps) {
  const { data: project, isLoading, error } = useProject(id);

  const baseBreadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: dashboard().url },
    { title: 'Projets', href: '/projects/home' },
  ];

  if (isLoading) {
    return (
      <AppLayout breadcrumbs={[...baseBreadcrumbs, { title: 'Modification' }] }>
        <Head title="Modification du projet" />
        <div className="flex flex-col space-y-6 px-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout breadcrumbs={[...baseBreadcrumbs, { title: 'Erreur' }] }>
        <Head title="Erreur" />
        <div className="flex flex-col space-y-6 px-6">
          <div className="text-center text-destructive">
            Erreur lors du chargement du projet. Veuillez réessayer.
          </div>
        </div>
      </AppLayout>
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    ...baseBreadcrumbs,
    { title: project.title, href: `/projects/${project.id}` },
    { title: 'Modification' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Modification - ${project.title}`} />

      <div className="flex flex-col space-y-6 px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Modification du projet</h1>
            <p className="text-muted-foreground">Modifiez les informations du projet {project.title}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <ProjectForm project={project} />
        </div>
      </div>
    </AppLayout>
  );
}
