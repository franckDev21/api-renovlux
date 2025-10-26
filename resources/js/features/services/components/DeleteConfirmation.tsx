import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteService } from '../hooks/useServices';

interface DeleteConfirmationProps {
  isOpen: boolean;
  serviceId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteConfirmation({
  isOpen,
  serviceId,
  onClose,
  onSuccess,
}: DeleteConfirmationProps) {
  const deleteMutation = useDeleteService();

  const handleConfirm = () => {
    if (serviceId) {
      deleteMutation.mutate(serviceId, {
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
          <DialogTitle>Supprimer le service</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
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
