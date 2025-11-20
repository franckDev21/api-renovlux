import React, { useState } from 'react'
import { ProductDataTable } from './table/data-table'
import { columns } from './table/columns'
import { useProducts } from '../hooks/useProducts'
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteProductConfirmation } from './DeleteProductConfirmation'
import { Product } from '../types/product'

function ListingProduct() {
  const { data, isLoading, error } = useProducts()
  const [deleteProduct, setDeleteProduct] = useState<{ id: string; name: string } | null>(null)

  const handleDeleteClick = (product: Product) => {
    setDeleteProduct({ id: product.id, name: product.name })
  }

  const handleDeleteSuccess = () => {
    setDeleteProduct(null)
  }

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
    <>
      <ProductDataTable 
        columns={columns(handleDeleteClick)} 
        data={products} 
      />
      <DeleteProductConfirmation
        isOpen={!!deleteProduct}
        productId={deleteProduct?.id || null}
        productName={deleteProduct?.name}
        onClose={() => setDeleteProduct(null)}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default ListingProduct