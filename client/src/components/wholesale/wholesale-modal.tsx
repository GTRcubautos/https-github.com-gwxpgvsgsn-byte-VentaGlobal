import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const wholesaleSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  email: z.string().email('Email válido requerido'),
});

type WholesaleForm = z.infer<typeof wholesaleSchema>;

export default function WholesaleModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { setUser, setWholesaleUser } = useStore();

  const form = useForm<WholesaleForm>({
    resolver: zodResolver(wholesaleSchema),
    defaultValues: {
      code: '',
      email: '',
    },
  });

  useEffect(() => {
    const handleOpenWholesale = () => setIsOpen(true);
    window.addEventListener('openWholesale', handleOpenWholesale);
    return () => window.removeEventListener('openWholesale', handleOpenWholesale);
  }, []);

  const authenticateMutation = useMutation({
    mutationFn: async (data: WholesaleForm) => {
      const response = await apiRequest('POST', '/api/auth/wholesale', data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      setWholesaleUser(true);
      setIsOpen(false);
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al portal mayorista",
      });
      
      // Trigger wholesale products display
      const event = new CustomEvent('wholesaleAuthenticated');
      window.dispatchEvent(event);
    },
    onError: () => {
      toast({
        title: "Error de autenticación",
        description: "Código o email incorrecto. Contacte al administrador.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WholesaleForm) => {
    authenticateMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md" data-testid="wholesale-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-secondary">
            Acceso Mayoristas
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="code">Código de Acceso</Label>
            <Input
              id="code"
              type="password"
              placeholder="Ingrese su código"
              {...form.register('code')}
              data-testid="wholesale-code"
            />
            {form.formState.errors.code && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="su.email@empresa.com"
              {...form.register('email')}
              data-testid="wholesale-email"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={authenticateMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90"
            data-testid="wholesale-submit"
          >
            {authenticateMutation.isPending ? 'Verificando...' : 'Acceder'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to trigger wholesale modal from other components
export const openWholesaleModal = () => {
  const event = new CustomEvent('openWholesale');
  window.dispatchEvent(event);
};
