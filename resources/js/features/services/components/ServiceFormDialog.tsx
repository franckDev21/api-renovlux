import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ServiceForm } from './ServiceForm';
import { Service } from '../types/service';

interface ServiceFormDialogProps {
  isOpen: boolean;
  service?: Service | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ServiceFormDialog({
  isOpen,
  service,
  onClose,
  onSuccess,
}: ServiceFormDialogProps) {
  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {service ? 'Modifier le service' : 'Ajouter un nouveau service'}
          </DialogTitle>
        </DialogHeader>
        <ServiceForm
          service={service || undefined}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
