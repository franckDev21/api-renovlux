import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Product } from "../../types/product"

export type Payment = Product

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image_principale",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image_principale") as string | null
      return (
        <div className="w-16 h-16 rounded-md overflow-hidden border">
          {image ? (
            <img
              src={image}
              alt={row.original.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
              Aucune image
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prix
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "en_stock",
    header: "Stock",
    cell: ({ row }) => {
      const enStock = row.getValue("en_stock") as boolean
      return (
        <Badge variant={enStock ? "default" : "destructive"}>
          {enStock ? "En stock" : "Rupture"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "active",
    header: "Statut",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean
      return (
        <Badge variant={active ? "default" : "secondary"}>
          {active ? "Actif" : "Inactif"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de création
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return <div>{date.toLocaleDateString("fr-FR")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copier l'ID du produit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]