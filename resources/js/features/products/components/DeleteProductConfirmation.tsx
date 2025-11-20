import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteProduct } from '../hooks/useProducts';

interface DeleteProductConfirmationProps {
  isOpen: boolean;
  productId: string | null;
  productName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteProductConfirmation({
  isOpen,
  productId,
  productName,
  onClose,
  onSuccess,
}: DeleteProductConfirmationProps) {
  const deleteMutation = useDeleteProduct();

  const handleConfirm = () => {
    if (productId) {
      deleteMutation.mutate(productId, {
        onSuccess: () => {
          onClose();
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer le produit</DialogTitle>
          <DialogDescription>
            {productName ? (
              <>
                Êtes-vous sûr de vouloir supprimer le produit <strong>"{productName}"</strong> ? Cette action est irréversible et supprimera également toutes les images associées.
              </>
            ) : (
              <>
                Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et supprimera également toutes les images associées.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="ml-2"
          >
            {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

