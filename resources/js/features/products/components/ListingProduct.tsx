import React, { useState } from 'react'
import { ProductDataTable } from './table/data-table'
import { columns, type Payment } from './table/columns'

function ListingProduct() {
  const [data, setData] = useState<Payment[]>([
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ])

  
  return (
    <div>
      <ProductDataTable columns={columns} data={data} />
    </div>
  )
}

export default ListingProduct