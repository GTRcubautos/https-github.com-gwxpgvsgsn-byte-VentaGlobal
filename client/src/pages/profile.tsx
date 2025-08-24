import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Medal, Star, Award, Crown, Target, Calendar, 
  Zap, Shield, Gift, Check, Lock, Flame, Heart,
  ChevronRight, TrendingUp, User, ShoppingCart,
  MapPin, Phone, Mail, Settings, History, CreditCard
} from 'lucide-react';

// Datos de medallas y trofeos (reutilizando la lógica de games.tsx)
const getMedalsData = (userPoints: number, user: any) => {
  const visits = user?.visits || 0;
  const purchases = user?.purchases || 0;
  const gamesPlayed = user?.gamesPlayed || 0;
  const shareCount = user?.shareCount || 0;

  return [
    {
      id: 'visitante_novato',
      name: 'Visitante Novato',
      description: 'Visita el sitio 5 días',
      icon: Calendar,
      progress: Math.min(visits, 5),
      total: 5,
      earned: visits >= 5,
      rarity: 'bronze',
      points: 50
    },
    {
      id: 'visitante_regular',
      name: 'Visitante Regular',
      description: 'Visita el sitio 30 días',
      icon: Heart,
      progress: Math.min(visits, 30),
      total: 30,
      earned: visits >= 30,
      rarity: 'silver',
      points: 200
    },
    {
      id: 'visitante_dedicado',
      name: 'Visitante Dedicado',
      description: 'Visita el sitio 100 días',
      icon: Flame,
      progress: Math.min(visits, 100),
      total: 100,
      earned: visits >= 100,
      rarity: 'gold',
      points: 500
    },
    {
      id: 'primera_compra',
      name: 'Primera Compra',
      description: 'Realiza tu primera compra',
      icon: Gift,
      progress: Math.min(purchases, 1),
      total: 1,
      earned: purchases >= 1,
      rarity: 'bronze',
      points: 100
    },
    {
      id: 'comprador_frecuente',
      name: 'Comprador Frecuente',
      description: 'Realiza 10 compras',
      icon: Shield,
      progress: Math.min(purchases, 10),
      total: 10,
      earned: purchases >= 10,
      rarity: 'silver',
      points: 300
    },
    {
      id: 'maestro_jugador',
      name: 'Maestro Jugador',
      description: 'Juega 50 veces',
      icon: Target,
      progress: Math.min(gamesPlayed, 50),
      total: 50,
      earned: gamesPlayed >= 50,
      rarity: 'gold',
      points: 400
    },
    {
      id: 'influencer_social',
      name: 'Influencer Social',
      description: 'Comparte 25 veces',
      icon: Zap,
      progress: Math.min(shareCount, 25),
      total: 25,
      earned: shareCount >= 25,
      rarity: 'silver',
      points: 250
    }
  ];
};

const getTrophyData = (userPoints: number) => {
  return [
    {
      id: 'coleccionista_puntos',
      name: 'Coleccionista de Puntos',
      description: 'Acumula 10,000 puntos',
      icon: Trophy,
      progress: Math.min(userPoints, 10000),
      total: 10000,
      earned: userPoints >= 10000,
      tier: 'legendary'
    },
    {
      id: 'cliente_vip',
      name: 'Cliente VIP',
      description: 'Acumula 5,000 puntos',
      icon: Crown,
      progress: Math.min(userPoints, 5000),
      total: 5000,
      earned: userPoints >= 5000,
      tier: 'epic'
    },
    {
      id: 'estrella_ascendente',
      name: 'Estrella Ascendente',
      description: 'Acumula 1,000 puntos',
      icon: Star,
      progress: Math.min(userPoints, 1000),
      total: 1000,
      earned: userPoints >= 1000,
      tier: 'rare'
    }
  ];
};

const getVipStatus = (userPoints: number) => {
  if (userPoints >= 10000) return { level: 'ELITE', color: 'from-yellow-400 to-yellow-600', discount: 15 };
  if (userPoints >= 5000) return { level: 'PREMIUM', color: 'from-purple-400 to-purple-600', discount: 10 };
  if (userPoints >= 1000) return { level: 'VIP', color: 'from-blue-400 to-blue-600', discount: 5 };
  return { level: 'BÁSICO', color: 'from-gray-400 to-gray-600', discount: 0 };
};

export default function Profile() {
  const { userPoints, user } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const medals = getMedalsData(userPoints, user);
  const trophies = getTrophyData(userPoints);
  const vipStatus = getVipStatus(userPoints);
  const earnedMedals = medals.filter(m => m.earned);
  const earnedTrophies = trophies.filter(t => t.earned);
  const availableDiscount = (userPoints * 0.01).toFixed(2);

  return (
    <div className="min-h-screen bg-white py-16" data-testid="profile-page">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="bg-gray-800 text-white py-8 rounded-t-lg">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {user?.firstName || 'Cliente'} {user?.lastName || 'GTR'}
                </h1>
                <p className="text-gray-300">
                  {user?.email || 'cliente@gtrcubauto.com'}
                </p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${vipStatus.color} text-white font-bold text-sm mt-2`}>
                  <Crown className="h-4 w-4 mr-2" />
                  {vipStatus.level}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{userPoints.toLocaleString()}</div>
              <div className="text-gray-300">Puntos GTR</div>
              <div className="text-lg font-semibold">${availableDiscount}</div>
              <div className="text-gray-300 text-sm">En descuentos</div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card rounded-t-none">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="medals" className="flex items-center gap-2">
              <Medal className="h-4 w-4" />
              Medallas
            </TabsTrigger>
            <TabsTrigger value="trophies" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Trofeos
            </TabsTrigger>
            <TabsTrigger value="vip" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Estado VIP
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Estadísticas Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medallas ganadas:</span>
                    <span className="font-bold text-orange-500">{earnedMedals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trofeos ganados:</span>
                    <span className="font-bold text-yellow-500">{earnedTrophies.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compras realizadas:</span>
                    <span className="font-bold">{user?.purchases || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Días de visita:</span>
                    <span className="font-bold">{user?.visits || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Logros Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {earnedMedals.slice(-3).map((medal) => {
                    const IconComponent = medal.icon;
                    return (
                      <div key={medal.id} className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-full">
                          <IconComponent className="h-4 w-4 text-orange-400" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{medal.name}</div>
                          <div className="text-xs text-muted-foreground">+{medal.points} puntos</div>
                        </div>
                      </div>
                    );
                  })}
                  {earnedTrophies.map((trophy) => {
                    const IconComponent = trophy.icon;
                    return (
                      <div key={trophy.id} className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-full">
                          <IconComponent className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{trophy.name}</div>
                          <div className="text-xs text-muted-foreground">{trophy.tier}</div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* VIP Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    Beneficios VIP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${vipStatus.color} text-white font-bold`}>
                      {vipStatus.level}
                    </div>
                  </div>
                  {vipStatus.discount > 0 && (
                    <Badge className="w-full justify-center bg-green-600 text-white">
                      {vipStatus.discount}% Descuento Extra
                    </Badge>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Puntos por compras</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Acceso a juegos exclusivos</span>
                    </div>
                    {vipStatus.level !== 'BÁSICO' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Descuentos especiales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Soporte prioritario</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medals Tab */}
          <TabsContent value="medals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-6 w-6 text-orange-400" />
                  Colección de Medallas ({earnedMedals.length}/{medals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medals.map((medal) => {
                    const IconComponent = medal.icon;
                    const progressPercentage = (medal.progress / medal.total) * 100;
                    
                    return (
                      <div 
                        key={medal.id} 
                        className={`p-4 rounded-lg border-2 transition-all ${
                          medal.earned 
                            ? 'bg-orange-500/10 border-orange-400/50' 
                            : 'bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${
                            medal.earned ? 'bg-orange-500/20' : 'bg-muted'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              medal.earned ? 'text-orange-400' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-semibold ${
                                medal.earned ? 'text-orange-400' : 'text-muted-foreground'
                              }`}>
                                {medal.name}
                              </h4>
                              {medal.earned && <Check className="h-4 w-4 text-green-400" />}
                              <Badge variant={medal.earned ? 'default' : 'secondary'} className="text-xs">
                                {medal.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{medal.description}</p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-muted-foreground">
                                {medal.progress}/{medal.total}
                              </span>
                              <span className="text-xs text-primary">
                                +{medal.points} puntos
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trophies Tab */}
          <TabsContent value="trophies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Trofeos de Élite ({earnedTrophies.length}/{trophies.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {trophies.map((trophy) => {
                  const IconComponent = trophy.icon;
                  const progressPercentage = (trophy.progress / trophy.total) * 100;
                  
                  return (
                    <div 
                      key={trophy.id} 
                      className={`p-6 rounded-lg border-2 transition-all ${
                        trophy.earned 
                          ? 'bg-yellow-500/10 border-yellow-400/50' 
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-full ${
                          trophy.earned ? 'bg-yellow-500/20' : 'bg-muted'
                        }`}>
                          <IconComponent className={`h-10 w-10 ${
                            trophy.earned ? 'text-yellow-400' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-bold text-xl ${
                              trophy.earned ? 'text-yellow-400' : 'text-muted-foreground'
                            }`}>
                              {trophy.name}
                            </h3>
                            {trophy.earned && <Check className="h-6 w-6 text-green-400" />}
                            <Badge variant={trophy.earned ? 'default' : 'secondary'}>
                              {trophy.tier}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{trophy.description}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-muted-foreground">
                              {trophy.progress.toLocaleString()}/{trophy.total.toLocaleString()} puntos
                            </span>
                            <span className="font-bold text-yellow-400">
                              {progressPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* VIP Tab */}
          <TabsContent value="vip" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-primary" />
                    Estado Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${vipStatus.color} text-white font-bold text-lg mb-4`}>
                      {vipStatus.level}
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">{userPoints.toLocaleString()}</div>
                      <div className="text-muted-foreground">Puntos Totales</div>
                      <div className="text-2xl font-bold text-primary">${availableDiscount}</div>
                      <div className="text-muted-foreground">Disponible en descuentos</div>
                    </div>
                  </div>
                  
                  {vipStatus.discount > 0 && (
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500 mb-2">
                          {vipStatus.discount}%
                        </div>
                        <div className="text-sm text-green-600">
                          Descuento Extra en todas las compras
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* VIP Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Progreso VIP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress to next level */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">VIP (1,000 pts)</span>
                        <span className={userPoints >= 1000 ? 'text-green-500' : 'text-muted-foreground'}>
                          {userPoints >= 1000 ? '✓' : Math.max(0, 1000 - userPoints).toLocaleString() + ' pts'}
                        </span>
                      </div>
                      <Progress value={Math.min((userPoints / 1000) * 100, 100)} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">PREMIUM (5,000 pts)</span>
                        <span className={userPoints >= 5000 ? 'text-green-500' : 'text-muted-foreground'}>
                          {userPoints >= 5000 ? '✓' : Math.max(0, 5000 - userPoints).toLocaleString() + ' pts'}
                        </span>
                      </div>
                      <Progress value={Math.min((userPoints / 5000) * 100, 100)} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">ELITE (10,000 pts)</span>
                        <span className={userPoints >= 10000 ? 'text-green-500' : 'text-muted-foreground'}>
                          {userPoints >= 10000 ? '✓' : Math.max(0, 10000 - userPoints).toLocaleString() + ' pts'}
                        </span>
                      </div>
                      <Progress value={Math.min((userPoints / 10000) * 100, 100)} className="h-2" />
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Beneficios por Nivel:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>BÁSICO: Puntos por actividades</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>VIP: +5% descuento extra</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>PREMIUM: +10% descuento extra</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>ELITE: +15% descuento extra</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}