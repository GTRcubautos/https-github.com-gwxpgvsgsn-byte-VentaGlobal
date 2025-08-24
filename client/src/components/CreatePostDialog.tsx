import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Bot,
  Image as ImageIcon,
  Video,
  Hash,
  AtSign,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Youtube,
  X,
  Plus
} from "lucide-react";

const postSchema = z.object({
  content: z.string().min(1, "El contenido es requerido").max(2000, "Máximo 2000 caracteres"),
  platforms: z.array(z.string()).min(1, "Selecciona al menos una plataforma"),
  postType: z.enum(['manual', 'automated', 'template', 'recurring']),
  scheduledAt: z.string().optional(),
  hashtags: z.string().optional(),
  mentions: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
  automation: z.object({
    isRecurring: z.boolean(),
    frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    endDate: z.string().optional(),
  }).optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostDialogProps {
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

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      platforms: [],
      postType: "manual",
      mediaUrls: [],
      hashtags: "",
      mentions: "",
      automation: {
        isRecurring: false,
      }
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: PostFormData) => {
      const scheduledAt = selectedDate && selectedTime 
        ? new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`).toISOString()
        : undefined;

      const hashtags = postData.hashtags 
        ? postData.hashtags.split(' ').filter(tag => tag.startsWith('#'))
        : [];

      const mentions = postData.mentions
        ? postData.mentions.split(' ').filter(mention => mention.startsWith('@'))
        : [];

      return await apiRequest("POST", "/api/social-posts", {
        ...postData,
        scheduledAt,
        hashtags,
        mentions,
        mediaUrls: uploadedMediaUrls,
        status: scheduledAt ? 'scheduled' : 'published'
      });
    },
    onSuccess: () => {
      toast({
        title: "¡Post Creado!",
        description: "Tu publicación ha sido programada exitosamente",
        className: "bg-green-50 border-green-200"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      onOpenChange(false);
      form.reset();
      setUploadedMediaUrls([]);
      setSelectedDate(undefined);
      setSelectedTime("12:00");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la publicación",
        variant: "destructive"
      });
    }
  });

  const handleMediaUpload = (url: string) => {
    setUploadedMediaUrls(prev => [...prev, url]);
  };

  const removeMedia = (index: number) => {
    setUploadedMediaUrls(prev => prev.filter((_, i) => i !== index));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Nueva Publicación en Redes Sociales
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Crea y programa contenido para tus redes sociales con fotos, videos y fechas personalizadas
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createPostMutation.mutate(data))} className="space-y-6">
            
            {/* Selección de Plataformas */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">Plataformas de Destino *</Label>
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
                              className={`h-16 flex-col gap-2 ${
                                isSelected ? `${platform.color} text-white hover:opacity-90` : ''
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

            {/* Contenido del Post */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">Contenido *</Label>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="¿Qué quieres compartir con tu audiencia? Escribe contenido atractivo y relevante..."
                        className="min-h-[120px] resize-none border-gray-300 focus:border-primary"
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
                  Hashtags
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
                          className="border-gray-300 focus:border-primary"
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
                  Menciones
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
                          className="border-gray-300 focus:border-primary"
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

            {/* Medios */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Fotos y Videos
              </Label>
              <ObjectUploader
                onUploadComplete={handleMediaUpload}
                acceptedTypes={['image/*', 'video/*']}
                maxSize={50}
                multiple={true}
                className="border border-gray-300 rounded-lg"
              />
              
              {/* Media Preview */}
              {uploadedMediaUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uploadedMediaUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {url.includes('.mp4') || url.includes('.mov') ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-8 w-8 text-gray-400" />
                          </div>
                        ) : (
                          <img 
                            src={url} 
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Programación */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Programación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedDate !== undefined}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setSelectedDate(undefined);
                      } else {
                        setSelectedDate(new Date());
                      }
                    }}
                  />
                  <Label className="text-sm">Programar para más tarde</Label>
                </div>

                {selectedDate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Fecha</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Hora</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                {`${hour}:00`}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modo Avanzado */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch checked={isAdvancedMode} onCheckedChange={setIsAdvancedMode} />
                <Label className="text-sm">Opciones avanzadas</Label>
              </div>

              {isAdvancedMode && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <FormField
                    control={form.control}
                    name="postType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Publicación</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="automated">Automatizada</SelectItem>
                            <SelectItem value="template">Desde Plantilla</SelectItem>
                            <SelectItem value="recurring">Recurrente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('postType') === 'recurring' && (
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="automation.isRecurring"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Publicación recurrente</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch('automation.isRecurring') && (
                        <FormField
                          control={form.control}
                          name="automation.frequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frecuencia</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar frecuencia" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="daily">Diariamente</SelectItem>
                                  <SelectItem value="weekly">Semanalmente</SelectItem>
                                  <SelectItem value="monthly">Mensualmente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-4 gap-2">
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
                disabled={createPostMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white min-w-24"
              >
                {createPostMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creando...
                  </>
                ) : selectedDate ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Programar
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publicar Ahora
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