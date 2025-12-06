import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProject } from '@/features/projects/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteProject } from '@/features/projects/hooks/useProjects';

interface ShowProps {
  id: string;
}

export default function Show({ id }: ShowProps) {
  const { data: project, isLoading, error } = useProject(id);
  const deleteMutation = useDeleteProject();

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
      title: project?.title || 'Détails du projet',
    },
  ];

  if (isLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Détails du projet" />
        <div className="flex flex-col space-y-6 px-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Erreur" />
        <div className="flex flex-col space-y-6 px-6">
          <div className="text-center text-destructive">
            Erreur lors du chargement du projet. Veuillez réessayer.
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
      title: 'Projets',
      href: '/projects/home'
    },
    {
      title: project.title,
    },
  ];

  const onDelete = () => {
    if (confirm('Confirmer la suppression de ce projet ?')) {
      deleteMutation.mutate(project.id.toString(), {
        onSuccess: () => router.visit('/projects/home', { replace: true })
      });
    }
  };

  return (
    <AppLayout breadcrumbs={finalBreadcrumbs}>
      <Head title={`${project.title} - Détails`} />
      
      <div className="flex flex-col space-y-6 px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.visit('/projects/home')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
              <p className="text-muted-foreground">
                Détails du projet
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            <Button asChild>
              <Link href={`/projects/${project.id}/edit`} prefetch>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Image principale</CardTitle>
            </CardHeader>
            <CardContent>
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
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
                <p className="text-sm font-medium text-muted-foreground">Titre</p>
                <p className="text-lg">{project.title}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                <p className="text-sm">
                  {new Date(project.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {project.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {project.secondary_images && project.secondary_images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Images secondaires</CardTitle>
              <CardDescription>
                {project.secondary_images.length} image(s) supplémentaire(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.secondary_images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <img
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
