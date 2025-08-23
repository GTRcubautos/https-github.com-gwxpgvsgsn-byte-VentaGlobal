import { Button } from '@/components/ui/button';
import { openGameModal } from '@/components/games/game-modal';
import { useStore } from '@/lib/store';
import { getDailyVerse } from '@/lib/bible-verses';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Games() {
  const { userPoints, user, addPoints } = useStore();
  const { toast } = useToast();
  const dailyVerse = getDailyVerse();

  const saveGameResultMutation = useMutation({
    mutationFn: async (gameData: any) => {
      const response = await apiRequest('POST', '/api/games/result', gameData);
      return response.json();
    },
  });

  const shareToSocial = (platform: string) => {
    const points = 25;
    addPoints(points);
    
    if (user) {
      saveGameResultMutation.mutate({
        userId: user.id,
        gameType: 'social_share',
        pointsEarned: points,
      });
    }
    
    toast({
      title: `Compartido en ${platform}`,
      description: `Has ganado ${points} puntos`,
    });
  };

  const availableDiscount = (userPoints * 0.01).toFixed(2);

  return (
    <div className="py-16 bg-secondary text-white" data-testid="games-page">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">Centro de Juegos</h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        
        {/* Daily Bible Verse */}
        <div 
          className="bg-primary bg-opacity-20 rounded-lg p-6 mb-12 text-center max-w-2xl mx-auto"
          data-testid="daily-verse"
        >
          <h3 className="text-primary text-xl font-bold mb-4">Versículo del Día</h3>
          <p className="text-lg italic mb-2" data-testid="verse-text">
            "{dailyVerse.text}"
          </p>
          <p className="text-primary font-semibold" data-testid="verse-reference">
            - {dailyVerse.reference}
          </p>
        </div>
        
        {/* Rewards System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white bg-opacity-10 rounded-lg p-6" data-testid="rewards-info">
            <h3 className="text-primary text-2xl font-bold mb-4">🏆 Sistema de Recompensas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Puntos por visita diaria:</span>
                <span className="text-primary font-bold">+10 puntos</span>
              </div>
              <div className="flex justify-between">
                <span>Puntos por compra:</span>
                <span className="text-primary font-bold">+50 puntos</span>
              </div>
              <div className="flex justify-between">
                <span>Puntos por compartir:</span>
                <span className="text-primary font-bold">+25 puntos</span>
              </div>
              <div className="border-t border-primary pt-2 mt-4">
                <span className="text-lg font-bold">1 punto = $0.01 descuento</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6" data-testid="user-progress">
            <h3 className="text-primary text-2xl font-bold mb-4">📊 Tu Progreso</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Puntos Totales:</span>
                  <span className="text-primary font-bold" data-testid="total-points">
                    {userPoints.toLocaleString()} puntos
                  </span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((userPoints / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <span className="text-primary font-bold text-xl" data-testid="available-discount">
                  ${availableDiscount} en descuentos
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center" data-testid="trivia-game">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Trivia Challenge</h3>
            <p className="mb-4">Responde preguntas y gana puntos</p>
            <Button
              onClick={() => openGameModal('trivia')}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
              data-testid="play-trivia"
            >
              Jugar Ahora
            </Button>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center" data-testid="roulette-game">
            <div className="text-6xl mb-4">🎰</div>
            <h3 className="text-xl font-bold mb-2">Ruleta de Premios</h3>
            <p className="mb-4">Gira y gana descuentos increíbles</p>
            <Button
              onClick={() => openGameModal('roulette')}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
              data-testid="play-roulette"
            >
              Girar Ruleta
            </Button>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center" data-testid="puzzle-game">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-bold mb-2">Puzzle Master</h3>
            <p className="mb-4">Resuelve puzzles complejos</p>
            <Button
              onClick={() => openGameModal('puzzle')}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
              data-testid="play-puzzle"
            >
              Resolver
            </Button>
          </div>
        </div>
        
        {/* Social Sharing */}
        <div className="text-center" data-testid="social-sharing">
          <h3 className="text-2xl font-bold mb-4">¡Comparte y Gana!</h3>
          <p className="mb-6">
            Comparte tus compras en redes sociales y etiquétanos para ganar 25 puntos extra
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => shareToSocial('Facebook')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              data-testid="share-facebook"
            >
              <i className="fab fa-facebook-f mr-2"></i>Facebook
            </Button>
            <Button
              onClick={() => shareToSocial('Instagram')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2"
              data-testid="share-instagram"
            >
              <i className="fab fa-instagram mr-2"></i>Instagram
            </Button>
            <Button
              onClick={() => shareToSocial('Twitter')}
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2"
              data-testid="share-twitter"
            >
              <i className="fab fa-twitter mr-2"></i>Twitter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
