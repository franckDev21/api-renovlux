import React from 'react'
import { ProjectDataTable } from './table/data-table'
import { useProjectColumns } from './table/columns'
import { useProjects } from '../hooks/useProjects'
import { Skeleton } from '@/components/ui/skeleton'

function ListingProject() {
  const { data, isLoading, error } = useProjects()
  const columns = useProjectColumns()

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    console.error('Erreur chargement projets:', error);
    return (
      <div className="p-4 text-center text-destructive">
        Erreur lors du chargement des projets. Veuillez réessayer.
      </div>
    )
  }

  console.log('Données reçues de l\'API:', data);
  // Essayer différentes structures de données
  const projects = Array.isArray(data) 
    ? data 
    : data?.data || [];

  return (
    <div>
      <ProjectDataTable columns={columns} data={projects} />
    </div>
  )
}

export default ListingProject
