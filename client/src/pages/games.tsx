import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { openGameModal } from '@/components/games/game-modal';
import { useStore } from '@/lib/store';
import { getDailyVerse } from '@/lib/bible-verses';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Trophy, Medal, Star, Award, Crown, Target, Calendar, 
  Zap, Shield, Gift, Check, Lock, Flame, Heart,
  ChevronRight, TrendingUp
} from 'lucide-react';

// Datos de medallas y trofeos
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

export default function Games() {
  const { userPoints, user, addPoints } = useStore();
  const { toast } = useToast();
  const dailyVerse = getDailyVerse();
  
  const medals = getMedalsData(userPoints, user);
  const trophies = getTrophyData(userPoints);
  const vipStatus = getVipStatus(userPoints);
  const earnedMedals = medals.filter(m => m.earned);
  const earnedTrophies = trophies.filter(t => t.earned);

  const saveGameResultMutation = useMutation({
    mutationFn: async (gameData: any) => {
      const response = await apiRequest('POST', '/api/games/result', gameData);
      return response.json();
    },
  });

  const shareToSocial = (platform: string, url: string) => {
    const points = 25;
    addPoints(points);
    
    if (user) {
      saveGameResultMutation.mutate({
        userId: user.id,
        gameType: 'social_share',
        pointsEarned: points,
      });
    }
    
    // Open the social media app/website
    window.open(url, '_blank');
    
    toast({
      title: `Compartido en ${platform}`,
      description: `Has ganado ${points} puntos`,
    });
  };

  const availableDiscount = (userPoints * 0.01).toFixed(2);

  return (
    <div className="py-16 bg-white text-black" data-testid="games-page">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">Centro de Juegos</h2>
        <div className="w-20 h-1 bg-red-600 mx-auto mb-8"></div>
        
        {/* Daily Bible Verse */}
        <div 
          className="bg-gray-100 rounded-lg p-6 mb-12 text-center max-w-2xl mx-auto border border-gray-200"
          data-testid="daily-verse"
        >
          <h3 className="text-red-600 text-xl font-bold mb-4">Versículo del Día</h3>
          <p className="text-lg italic mb-2" data-testid="verse-text">
            "{dailyVerse.text}"
          </p>
          <p className="text-red-600 font-semibold" data-testid="verse-reference">
            - {dailyVerse.reference}
          </p>
        </div>
        
        {/* VIP Status & Rewards Overview - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 px-2 md:px-0">
          {/* VIP Status */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Crown className="h-6 w-6 text-yellow-400" />
                Estado VIP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-600 text-white font-bold">
                  {vipStatus.level}
                </div>
                <div className="text-black">
                  <div className="text-3xl font-bold" data-testid="total-points">
                    {userPoints.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Puntos Totales</div>
                </div>
                <div className="text-red-600 font-bold text-xl" data-testid="available-discount">
                  ${availableDiscount} en descuentos
                </div>
                {vipStatus.discount > 0 && (
                  <Badge className="bg-green-600 text-white">
                    {vipStatus.discount}% descuento extra VIP
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medallas Earned */}
          <Card className="bg-gray-900 dark:bg-gray-100 border-gray-700 dark:border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Medal className="h-6 w-6 text-orange-400" />
                Medallas Ganadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-orange-400">
                  {earnedMedals.length}
                </div>
                <div className="text-sm text-gray-300">
                  de {medals.length} medallas disponibles
                </div>
                <div className="flex justify-center space-x-1">
                  {earnedMedals.slice(0, 3).map((medal) => {
                    const IconComponent = medal.icon;
                    return (
                      <div key={medal.id} className="p-2 bg-orange-500/20 rounded-full">
                        <IconComponent className="h-4 w-4 text-orange-400" />
                      </div>
                    );
                  })}
                  {earnedMedals.length > 3 && (
                    <div className="p-2 bg-orange-500/20 rounded-full text-orange-400 text-xs font-bold">
                      +{earnedMedals.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trofeos Earned */}
          <Card className="bg-gray-900 dark:bg-gray-100 border-gray-700 dark:border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-6 w-6 text-yellow-400" />
                Trofeos Ganados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-yellow-400">
                  {earnedTrophies.length}
                </div>
                <div className="text-sm text-gray-300">
                  de {trophies.length} trofeos disponibles
                </div>
                <div className="flex justify-center space-x-1">
                  {earnedTrophies.map((trophy) => {
                    const IconComponent = trophy.icon;
                    return (
                      <div key={trophy.id} className="p-2 bg-yellow-500/20 rounded-full">
                        <IconComponent className="h-4 w-4 text-yellow-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medallas y Trofeos Section - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 px-2 md:px-0">
          {/* Medallas */}
          <Card className="bg-gray-900 dark:bg-gray-100 border-gray-700 dark:border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Medal className="h-6 w-6 text-orange-400" />
                Medallas por Logros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medals.map((medal) => {
                const IconComponent = medal.icon;
                const progressPercentage = (medal.progress / medal.total) * 100;
                
                return (
                  <div 
                    key={medal.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      medal.earned 
                        ? 'bg-orange-500/20 border-orange-400/50' 
                        : 'bg-gray-800/50 border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        medal.earned ? 'bg-orange-500/30' : 'bg-gray-700'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          medal.earned ? 'text-orange-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${
                            medal.earned ? 'text-orange-400' : 'text-gray-300'
                          }`}>
                            {medal.name}
                          </h4>
                          {medal.earned && <Check className="h-4 w-4 text-green-400" />}
                          <Badge variant={medal.earned ? 'default' : 'secondary'} className="text-xs">
                            {medal.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{medal.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">
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
            </CardContent>
          </Card>

          {/* Trofeos */}
          <Card className="bg-gray-900 dark:bg-gray-100 border-gray-700 dark:border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-6 w-6 text-yellow-400" />
                Trofeos de Élite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trophies.map((trophy) => {
                const IconComponent = trophy.icon;
                const progressPercentage = (trophy.progress / trophy.total) * 100;
                
                return (
                  <div 
                    key={trophy.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      trophy.earned 
                        ? 'bg-yellow-500/20 border-yellow-400/50' 
                        : 'bg-gray-800/50 border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        trophy.earned ? 'bg-yellow-500/30' : 'bg-gray-700'
                      }`}>
                        <IconComponent className={`h-8 w-8 ${
                          trophy.earned ? 'text-yellow-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold text-lg ${
                            trophy.earned ? 'text-yellow-400' : 'text-gray-300'
                          }`}>
                            {trophy.name}
                          </h4>
                          {trophy.earned && <Check className="h-5 w-5 text-green-400" />}
                          <Badge variant={trophy.earned ? 'default' : 'secondary'} className="text-xs">
                            {trophy.tier}
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-3">{trophy.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">
                            {trophy.progress.toLocaleString()}/{trophy.total.toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-yellow-400">
                            {progressPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Siguiente Objetivo */}
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <h4 className="font-semibold text-blue-400">Próximo Objetivo</h4>
                </div>
                <p className="text-sm text-gray-300">
                  {userPoints < 1000 ? 'Alcanza 1,000 puntos para tu primer trofeo' :
                   userPoints < 5000 ? 'Faltan ' + (5000 - userPoints).toLocaleString() + ' puntos para Cliente VIP' :
                   userPoints < 10000 ? 'Faltan ' + (10000 - userPoints).toLocaleString() + ' puntos para Coleccionista de Puntos' :
                   '¡Has alcanzado todos los trofeos!'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Games Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 px-2 md:px-0">
          <div className="bg-gray-800 dark:bg-gray-200 rounded-lg p-6 text-center" data-testid="trivia-game">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Trivia Challenge</h3>
            <p className="mb-4">Responde preguntas y gana puntos</p>
            <Button
              onClick={() => openGameModal('trivia')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
              data-testid="play-trivia"
            >
              Jugar Ahora
            </Button>
          </div>
          
          <div className="bg-gray-800 dark:bg-gray-200 rounded-lg p-6 text-center" data-testid="roulette-game">
            <div className="text-6xl mb-4">🎰</div>
            <h3 className="text-xl font-bold mb-2">Ruleta de Premios</h3>
            <p className="mb-4">Gira y gana descuentos increíbles</p>
            <Button
              onClick={() => openGameModal('roulette')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
              data-testid="play-roulette"
            >
              Girar Ruleta
            </Button>
          </div>
          
          <div className="bg-gray-800 dark:bg-gray-200 rounded-lg p-6 text-center" data-testid="puzzle-game">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-bold mb-2">Puzzle Master</h3>
            <p className="mb-4">Resuelve puzzles complejos</p>
            <Button
              onClick={() => openGameModal('puzzle')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
              data-testid="play-puzzle"
            >
              Resolver
            </Button>
          </div>
        </div>
        
        {/* Social Sharing - Mobile Optimized */}
        <div className="text-center" data-testid="social-sharing">
          <h3 className="text-2xl font-bold mb-4">¡Comparte y Gana!</h3>
          <p className="mb-6 px-4 text-sm md:text-base">
            Comparte tus compras en redes sociales y etiquétanos para ganar 25 puntos extra
          </p>
          <div className="flex justify-center items-center space-x-3 md:space-x-6 px-4">
            <Button
              onClick={() => shareToSocial('Facebook', 'https://www.facebook.com/sharer/sharer.php?u=https://gtrcubauto.com')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-transform hover:scale-110"
              data-testid="share-facebook"
            >
              <i className="fab fa-facebook-f text-lg md:text-xl"></i>
            </Button>
            <Button
              onClick={() => shareToSocial('Instagram', 'https://www.instagram.com')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 md:p-4 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-transform hover:scale-110"
              data-testid="share-instagram"
            >
              <i className="fab fa-instagram text-lg md:text-xl"></i>
            </Button>
            <Button
              onClick={() => shareToSocial('WhatsApp', 'https://api.whatsapp.com/send?text=¡Mira%20GTR%20CUBAUTO%20-%20Los%20mejores%20repuestos!%20https://gtrcubauto.com')}
              className="bg-green-600 hover:bg-green-700 text-white p-3 md:p-4 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-transform hover:scale-110"
              data-testid="share-whatsapp"
            >
              <i className="fab fa-whatsapp text-lg md:text-xl"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
