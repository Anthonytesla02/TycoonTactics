import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameDashboard } from "./components/GameDashboard";
import { TaskTracker } from "./components/TaskTracker";
import { useGameState } from "./lib/stores/useGameState";
import { useMarketData } from "./lib/stores/useMarketData";
import { initializeWebSocket } from "./lib/gameEngine";
import "@fontsource/inter";

const queryClient = new QueryClient();

function GameApp() {
  const { initializeGame, gameStarted } = useGameState();
  const { connectToMarket } = useMarketData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize WebSocket connection
        await initializeWebSocket();
        
        // Initialize game state
        initializeGame();
        
        // Connect to market data
        connectToMarket();
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize game:", error);
        setIsLoading(false);
      }
    };

    initApp();
  }, [initializeGame, connectToMarket]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Financial Tycoon...</div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Financial Tycoon</h1>
          <p className="text-xl mb-8">Build your business empire from $100,000</p>
          <button
            onClick={() => useGameState.getState().startGame()}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameDashboard />
      <TaskTracker />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameApp />
    </QueryClientProvider>
  );
}

export default App;
