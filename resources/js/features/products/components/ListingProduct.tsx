import React from 'react'
import { ProductDataTable } from './table/data-table'
import { columns } from './table/columns'
import { useProducts } from '../hooks/useProducts'
import { Skeleton } from '@/components/ui/skeleton'

function ListingProduct() {
  const { data, isLoading, error } = useProducts()

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Erreur lors du chargement des produits. Veuillez réessayer.
      </div>
    )
  }

  const products = data?.data || []
  
  return (
    <div>
      <ProductDataTable columns={columns} data={products} />
    </div>
  )
}

export default ListingProduct