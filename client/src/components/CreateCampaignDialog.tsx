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
import {
  Zap,
  Target,
  DollarSign,
  Calendar as CalendarIcon,
  Clock,
  Users,
  TrendingUp,
  Bot,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Youtube,
  Play,
  BarChart3
} from "lucide-react";

const campaignSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  description: z.string().min(1, "La descripción es requerida").max(500, "Máximo 500 caracteres"),
  automationType: z.enum(['producto_nuevo', 'promocion', 'engagement', 'retargeting', 'seasonal']),
  platforms: z.array(z.string()).min(1, "Selecciona al menos una plataforma"),
  targetAudience: z.string().min(1, "Define tu audiencia objetivo"),
  dailyBudget: z.number().min(0, "El presupuesto debe ser mayor a 0"),
  startDate: z.string(),
  endDate: z.string().optional(),
  isAutomated: z.boolean(),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    times: z.array(z.string()),
    days: z.array(z.string()).optional(),
  }),
  triggers: z.object({
    newProduct: z.boolean(),
    lowStock: z.boolean(),
    priceChange: z.boolean(),
    engagement: z.boolean(),
  }),
  rules: z.object({
    maxPostsPerDay: z.number().min(1),
    minTimeBetweenPosts: z.number().min(1),
    autoStop: z.boolean(),
  }),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignDialogProps {
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

const automationTypes = [
  { 
    id: 'producto_nuevo', 
    name: 'Productos Nuevos', 
    description: 'Publica automáticamente cuando llegan nuevos productos',
    icon: '🆕'
  },
  { 
    id: 'promocion', 
    name: 'Promociones', 
    description: 'Crea ofertas automáticas basadas en inventario',
    icon: '🏷️'
  },
  { 
    id: 'engagement', 
    name: 'Engagement', 
    description: 'Aumenta la interacción con contenido personalizado',
    icon: '❤️'
  },
  { 
    id: 'retargeting', 
    name: 'Retargeting', 
    description: 'Reconecta con clientes que visitaron productos',
    icon: '🎯'
  },
  { 
    id: 'seasonal', 
    name: 'Estacional', 
    description: 'Campañas basadas en fechas especiales',
    icon: '🗓️'
  },
];

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

const weekDays = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' },
];

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['09:00', '15:00', '19:00']);
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      automationType: "producto_nuevo",
      platforms: [],
      targetAudience: "",
      dailyBudget: 50,
      isAutomated: true,
      schedule: {
        frequency: "daily",
        times: ['09:00', '15:00', '19:00'],
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      },
      triggers: {
        newProduct: true,
        lowStock: false,
        priceChange: false,
        engagement: false,
      },
      rules: {
        maxPostsPerDay: 3,
        minTimeBetweenPosts: 2,
        autoStop: false,
      },
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: CampaignFormData) => {
      const startDateStr = startDate ? startDate.toISOString() : new Date().toISOString();
      const endDateStr = endDate ? endDate.toISOString() : undefined;

      return await apiRequest("POST", "/api/campaigns", {
        ...campaignData,
        startDate: startDateStr,
        endDate: endDateStr,
        schedule: {
          ...campaignData.schedule,
          times: selectedTimes,
          days: selectedDays,
        },
        status: 'active',
      });
    },
    onSuccess: () => {
      toast({
        title: "¡Campaña Creada!",
        description: "Tu campaña automatizada está activa y funcionando",
        className: "bg-green-50 border-green-200"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      onOpenChange(false);
      form.reset();
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedTimes(['09:00', '15:00', '19:00']);
      setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la campaña",
        variant: "destructive"
      });
    }
  });

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time].sort()
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-gray-700" />
            Nueva Campaña Automatizada
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Configura una campaña inteligente que se ejecute automáticamente basada en tus reglas de negocio
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createCampaignMutation.mutate(data))} className="space-y-6">
            
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Nombre de la Campaña *</Label>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ej: Promoción Automática Verano 2024"
                          className="border-gray-300 focus:border-gray-700 bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Presupuesto Diario *</Label>
                <FormField
                  control={form.control}
                  name="dailyBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="50"
                            className="pl-10 border-gray-300 focus:border-gray-700 bg-white"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">Descripción *</Label>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe el objetivo y estrategia de tu campaña automatizada..."
                        className="min-h-[80px] resize-none border-gray-300 focus:border-gray-700 bg-white"
                        maxLength={500}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{field.value.length}/500 caracteres</span>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Tipo de Automatización */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">Tipo de Automatización *</Label>
              <FormField
                control={form.control}
                name="automationType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {automationTypes.map((type) => (
                          <div
                            key={type.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              field.value === type.id 
                                ? 'border-gray-800 bg-gray-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={() => field.onChange(type.id)}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{type.icon}</span>
                              <div>
                                <h3 className="font-medium text-gray-900">{type.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Plataformas */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">Plataformas Objetivo *</Label>
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

            {/* Audiencia Objetivo */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">Audiencia Objetivo *</Label>
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej: Mecánicos, propietarios de autos, talleres especializados"
                        className="border-gray-300 focus:border-gray-700 bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Fecha de Inicio *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Fecha de Fin (Opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {endDate ? format(endDate, "PPP", { locale: es }) : "Sin fecha límite"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Horarios de Publicación */}
            <Card className="border-gray-200 bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                  <Clock className="h-4 w-4" />
                  Horarios de Publicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="schedule.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frecuencia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="daily">Diariamente</SelectItem>
                          <SelectItem value="weekly">Semanalmente</SelectItem>
                          <SelectItem value="monthly">Mensualmente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Horarios */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Horarios Preferidos</Label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTimes.includes(time) ? "default" : "outline"}
                        size="sm"
                        className={`text-xs ${
                          selectedTimes.includes(time) 
                            ? 'bg-gray-800 text-white hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Seleccionados: {selectedTimes.length} horarios
                  </p>
                </div>

                {/* Días de la semana */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Días de la Semana</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <Button
                        key={day.id}
                        type="button"
                        variant={selectedDays.includes(day.id) ? "default" : "outline"}
                        size="sm"
                        className={`text-xs ${
                          selectedDays.includes(day.id) 
                            ? 'bg-gray-800 text-white hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleDay(day.id)}
                      >
                        {day.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Triggers de Automatización */}
            <Card className="border-gray-200 bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                  <Target className="h-4 w-4" />
                  Disparadores Automáticos
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Configura qué eventos activarán automáticamente las publicaciones
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="triggers.newProduct"
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                        <div>
                          <Label className="text-sm font-medium text-gray-900">Producto Nuevo</Label>
                          <p className="text-xs text-gray-600">Cuando se agrega un nuevo producto</p>
                        </div>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="triggers.lowStock"
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                        <div>
                          <Label className="text-sm font-medium text-gray-900">Stock Bajo</Label>
                          <p className="text-xs text-gray-600">Cuando el inventario está bajo</p>
                        </div>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="triggers.priceChange"
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                        <div>
                          <Label className="text-sm font-medium text-gray-900">Cambio de Precio</Label>
                          <p className="text-xs text-gray-600">Cuando hay ofertas o descuentos</p>
                        </div>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="triggers.engagement"
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                        <div>
                          <Label className="text-sm font-medium text-gray-900">Engagement Alto</Label>
                          <p className="text-xs text-gray-600">Cuando hay mucha interacción</p>
                        </div>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reglas de Automatización */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch checked={isAdvancedMode} onCheckedChange={setIsAdvancedMode} />
                <Label className="text-sm">Configuración avanzada</Label>
              </div>

              {isAdvancedMode && (
                <Card className="border-gray-200 bg-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                      <BarChart3 className="h-4 w-4" />
                      Reglas de Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rules.maxPostsPerDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Máximo Posts por Día</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={1}
                                max={10}
                                className="border-gray-300 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rules.minTimeBetweenPosts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiempo Mínimo Entre Posts (horas)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={1}
                                max={24}
                                className="border-gray-300 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="rules.autoStop"
                      render={({ field }) => (
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                          <div>
                            <Label className="text-sm font-medium text-gray-900">Auto-Pausa</Label>
                            <p className="text-xs text-gray-600">Pausar automáticamente si el rendimiento es bajo</p>
                          </div>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>
              )}
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
                disabled={createCampaignMutation.isPending}
                className="bg-gray-800 hover:bg-gray-700 text-white min-w-32"
              >
                {createCampaignMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Activando...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Activar Campaña
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