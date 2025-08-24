import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  FileText,
  Hash,
  AtSign,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Youtube,
  Plus,
  X,
  Save,
  Sparkles
} from "lucide-react";

const templateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  content: z.string().min(1, "El contenido es requerido").max(2000, "Máximo 2000 caracteres"),
  category: z.enum(['promocional', 'informativo', 'educativo', 'entretenimiento', 'producto']),
  platforms: z.array(z.string()).min(1, "Selecciona al menos una plataforma"),
  variables: z.array(z.string()).optional(),
  hashtags: z.string().optional(),
  mentions: z.string().optional(),
  mediaRequired: z.boolean(),
  isActive: z.boolean(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Platform {
  id: string;
  name: string;
  icon: any;
  color: string;
}

const platforms: Platform[] = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
];

const categories = [
  { id: 'promocional', name: 'Promocional', description: 'Ofertas y descuentos' },
  { id: 'informativo', name: 'Informativo', description: 'Noticias y actualizaciones' },
  { id: 'educativo', name: 'Educativo', description: 'Tips y tutoriales' },
  { id: 'entretenimiento', name: 'Entretenimiento', description: 'Contenido divertido' },
  { id: 'producto', name: 'Producto', description: 'Destacar productos' },
];

export function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      content: "",
      category: "promocional",
      platforms: [],
      variables: [],
      hashtags: "",
      mentions: "",
      mediaRequired: false,
      isActive: true,
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: TemplateFormData) => {
      const hashtags = templateData.hashtags 
        ? templateData.hashtags.split(' ').filter(tag => tag.startsWith('#'))
        : [];

      const mentions = templateData.mentions
        ? templateData.mentions.split(' ').filter(mention => mention.startsWith('@'))
        : [];

      return await apiRequest("POST", "/api/content-templates", {
        ...templateData,
        hashtags,
        mentions,
        variables: templateVariables,
      });
    },
    onSuccess: () => {
      toast({
        title: "¡Plantilla Creada!",
        description: "Tu plantilla de contenido ha sido guardada exitosamente",
        className: "bg-green-50 border-green-200"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content-templates"] });
      onOpenChange(false);
      form.reset();
      setTemplateVariables([]);
      setNewVariable("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la plantilla",
        variant: "destructive"
      });
    }
  });

  const addVariable = () => {
    if (newVariable.trim() && !templateVariables.includes(newVariable.trim())) {
      setTemplateVariables([...templateVariables, newVariable.trim()]);
      setNewVariable("");
    }
  };

  const removeVariable = (variable: string) => {
    setTemplateVariables(templateVariables.filter(v => v !== variable));
  };

  const insertVariable = (variable: string) => {
    const currentContent = form.getValues('content');
    form.setValue('content', `${currentContent} {{${variable}}}`);
  };

  const addHashtag = (hashtag: string) => {
    const current = form.getValues('hashtags') || '';
    if (!current.includes(hashtag)) {
      form.setValue('hashtags', current ? `${current} ${hashtag}` : hashtag);
    }
  };

  const addMention = (mention: string) => {
    const current = form.getValues('mentions') || '';
    if (!current.includes(mention)) {
      form.setValue('mentions', current ? `${current} ${mention}` : mention);
    }
  };

  const suggestedHashtags = [
    '#GTRCubauto', '#RepuestosAuto', '#CalidadPremium', '#CubAutoPartes',
    '#MotorcycleLife', '#AutoParts', '#CarCare', '#Motors'
  ];

  const suggestedMentions = [
    '@gtrcubauto', '@cliente_vip', '@equipo_ventas'
  ];

  const commonVariables = [
    'nombre_producto', 'precio', 'descuento', 'fecha', 'cliente', 'marca', 'modelo'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-700" />
            Nueva Plantilla de Contenido
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Crea plantillas reutilizables para automatizar tu contenido en redes sociales
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createTemplateMutation.mutate(data))} className="space-y-6">
            
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Nombre de la Plantilla *</Label>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ej: Promoción Productos Premium"
                          className="border-gray-300 focus:border-gray-700 bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Categoría *</Label>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-200">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div>
                                <div className="font-medium">{category.name}</div>
                                <div className="text-xs text-gray-500">{category.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Selección de Plataformas */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">Plataformas Compatibles *</Label>
              <FormField
                control={form.control}
                name="platforms"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {platforms.map((platform) => {
                          const PlatformIcon = platform.icon;
                          const isSelected = field.value.includes(platform.id);
                          return (
                            <Button
                              key={platform.id}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              className={`h-16 flex-col gap-2 border-gray-300 ${
                                isSelected ? 'bg-gray-800 text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                const newValue = isSelected 
                                  ? field.value.filter(p => p !== platform.id)
                                  : [...field.value, platform.id];
                                field.onChange(newValue);
                              }}
                            >
                              <PlatformIcon className="h-5 w-5" />
                              <span className="text-xs font-medium">{platform.name}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Variables Dinámicas */}
            <Card className="border-gray-200 bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                  <Sparkles className="h-4 w-4" />
                  Variables Dinámicas
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Agrega variables que se reemplazarán automáticamente en cada publicación
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ej: nombre_producto"
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    className="flex-1 border-gray-300 bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                  />
                  <Button 
                    type="button" 
                    onClick={addVariable}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Variables Sugeridas */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Variables comunes:</Label>
                  <div className="flex flex-wrap gap-1">
                    {commonVariables.map((variable) => (
                      <Button
                        key={variable}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2 text-gray-600 border-gray-300 hover:bg-gray-100"
                        onClick={() => setNewVariable(variable)}
                      >
                        {variable}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Variables Agregadas */}
                {templateVariables.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Variables en la plantilla:</Label>
                    <div className="flex flex-wrap gap-2">
                      {templateVariables.map((variable) => (
                        <div key={variable} className="flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1">
                          <span className="text-xs font-mono">{'{{' + variable + '}}'}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 text-gray-500 hover:text-red-500"
                            onClick={() => removeVariable(variable)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 text-gray-500 hover:text-blue-500"
                            onClick={() => insertVariable(variable)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contenido de la Plantilla */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">Contenido de la Plantilla *</Label>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="🌟 ¡Nuevo {{nombre_producto}} disponible! 
💰 Precio especial: ${{precio}}
🚗 Perfecto para tu {{marca}} {{modelo}}
📞 ¡Contáctanos ahora!"
                        className="min-h-[150px] resize-none border-gray-300 focus:border-gray-700 bg-white"
                        maxLength={2000}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{field.value.length}/2000 caracteres</span>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Hashtags y Menciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Hashtags por Defecto
                </Label>
                <FormField
                  control={form.control}
                  name="hashtags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="#GTRCubauto #RepuestosAuto"
                          className="border-gray-300 focus:border-gray-700 bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-1">
                  {suggestedHashtags.map((hashtag) => (
                    <Button
                      key={hashtag}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2 text-blue-600 hover:bg-blue-50"
                      onClick={() => addHashtag(hashtag)}
                    >
                      {hashtag}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <AtSign className="h-4 w-4" />
                  Menciones por Defecto
                </Label>
                <FormField
                  control={form.control}
                  name="mentions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="@gtrcubauto @cliente_vip"
                          className="border-gray-300 focus:border-gray-700 bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-1">
                  {suggestedMentions.map((mention) => (
                    <Button
                      key={mention}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2 text-green-600 hover:bg-green-50"
                      onClick={() => addMention(mention)}
                    >
                      {mention}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Opciones Adicionales */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-gray-900">Requiere Medios</Label>
                  <p className="text-xs text-gray-600">La plantilla necesita fotos o videos</p>
                </div>
                <FormField
                  control={form.control}
                  name="mediaRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-gray-900">Plantilla Activa</Label>
                  <p className="text-xs text-gray-600">Disponible para usar en publicaciones</p>
                </div>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="border-t border-gray-200 pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createTemplateMutation.isPending}
                className="bg-gray-800 hover:bg-gray-700 text-white min-w-24"
              >
                {createTemplateMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Plantilla
                  </>
                )}
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}