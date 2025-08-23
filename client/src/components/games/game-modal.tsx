import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface GameState {
  isOpen: boolean;
  gameType: 'trivia' | 'roulette' | 'puzzle' | null;
  title: string;
  content: React.ReactNode;
}

export default function GameModal() {
  const [gameState, setGameState] = useState<GameState>({
    isOpen: false,
    gameType: null,
    title: '',
    content: null,
  });
  
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [rouletteResult, setRouletteResult] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { user, addPoints } = useStore();

  const saveGameResultMutation = useMutation({
    mutationFn: async (gameData: any) => {
      const response = await apiRequest('POST', '/api/games/result', gameData);
      return response.json();
    },
    onSuccess: (data) => {
      addPoints(data.pointsEarned);
    },
  });

  useEffect(() => {
    const handleOpenGame = (event: CustomEvent) => {
      const { gameType } = event.detail;
      openGame(gameType);
    };

    window.addEventListener('openGame', handleOpenGame as EventListener);
    return () => window.removeEventListener('openGame', handleOpenGame as EventListener);
  }, []);

  const openGame = (gameType: 'trivia' | 'roulette' | 'puzzle') => {
    setGameState({
      isOpen: true,
      gameType,
      title: getGameTitle(gameType),
      content: getGameContent(gameType),
    });
    
    // Reset states
    setPuzzleAnswer('');
    setRouletteResult(null);
  };

  const closeGame = () => {
    setGameState({
      isOpen: false,
      gameType: null,
      title: '',
      content: null,
    });
  };

  const getGameTitle = (gameType: string) => {
    switch (gameType) {
      case 'trivia': return 'Trivia Challenge';
      case 'roulette': return 'Ruleta de Premios';
      case 'puzzle': return 'Puzzle Master';
      default: return 'Juego';
    }
  };

  const saveGameResult = (gameType: string, pointsEarned: number) => {
    if (user) {
      saveGameResultMutation.mutate({
        userId: user.id,
        gameType,
        pointsEarned,
      });
    }
  };

  const answerTrivia = (isCorrect: boolean) => {
    if (isCorrect) {
      const points = 50;
      saveGameResult('trivia', points);
      toast({
        title: "¡Correcto!",
        description: `Has ganado ${points} puntos`,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: "¡Inténtalo de nuevo!",
        variant: "destructive",
      });
    }
    closeGame();
  };

  const spinRoulette = () => {
    const prizes = [10, 25, 50, 100, 5];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    setRouletteResult(prize);
    saveGameResult('roulette', prize);
    
    toast({
      title: "¡Ruleta!",
      description: `Has ganado ${prize} puntos`,
    });
  };

  const solvePuzzle = () => {
    const answer = parseInt(puzzleAnswer);
    if (answer === 8) { // 2 + 2 × 3 = 2 + 6 = 8
      const points = 75;
      saveGameResult('puzzle', points);
      toast({
        title: "¡Puzzle resuelto!",
        description: `Has ganado ${points} puntos`,
      });
    } else {
      toast({
        title: "Respuesta incorrecta",
        description: "La respuesta correcta es 8",
        variant: "destructive",
      });
    }
    closeGame();
  };

  const getGameContent = (gameType: string) => {
    switch (gameType) {
      case 'trivia':
        return (
          <div className="text-center">
            <h3 className="text-xl mb-4">¿Cuál es la capital de Francia?</h3>
            <div className="space-y-2">
              <Button
                onClick={() => answerTrivia(true)}
                className="w-full bg-primary text-white"
                data-testid="trivia-correct"
              >
                París
              </Button>
              <Button
                onClick={() => answerTrivia(false)}
                variant="outline"
                className="w-full"
                data-testid="trivia-wrong-1"
              >
                Londres
              </Button>
              <Button
                onClick={() => answerTrivia(false)}
                variant="outline"
                className="w-full"
                data-testid="trivia-wrong-2"
              >
                Madrid
              </Button>
            </div>
          </div>
        );
        
      case 'roulette':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🎰</div>
            <Button
              onClick={spinRoulette}
              className="bg-primary text-white px-6 py-3 rounded-lg"
              data-testid="spin-roulette"
            >
              ¡Girar!
            </Button>
            {rouletteResult && (
              <div className="mt-4 text-green-600 font-bold" data-testid="roulette-result">
                ¡Ganaste {rouletteResult} puntos!
              </div>
            )}
          </div>
        );
        
      case 'puzzle':
        return (
          <div className="text-center">
            <p className="mb-4">Resuelve: 2 + 2 × 3 = ?</p>
            <Input
              type="number"
              value={puzzleAnswer}
              onChange={(e) => setPuzzleAnswer(e.target.value)}
              className="mb-4 w-20 mx-auto"
              data-testid="puzzle-answer"
            />
            <br />
            <Button
              onClick={solvePuzzle}
              className="bg-primary text-white px-6 py-2 rounded-lg"
              data-testid="solve-puzzle"
            >
              Resolver
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={gameState.isOpen} onOpenChange={closeGame}>
      <DialogContent className="max-w-md" data-testid="game-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-secondary">
            {gameState.title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {gameState.content}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to trigger game modal from other components
export const openGameModal = (gameType: 'trivia' | 'roulette' | 'puzzle') => {
  const event = new CustomEvent('openGame', { detail: { gameType } });
  window.dispatchEvent(event);
};
