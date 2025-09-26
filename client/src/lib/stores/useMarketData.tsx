import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  priceHistory: number[];
  volatility: number;
  sector: string;
}

interface MarketState {
  stocks: Stock[];
  isConnected: boolean;
  lastUpdate: number;
  
  // Actions
  connectToMarket: () => void;
  updateStock: (symbol: string, price: number) => void;
  getStockPrice: (symbol: string) => number;
  initializeStocks: () => void;
}

const INITIAL_STOCKS: Omit<Stock, 'priceHistory'>[] = [
  { symbol: 'APEX', name: 'Apex Technologies', price: 150.00, volatility: 0.02, sector: 'Technology' },
  { symbol: 'NOVA', name: 'Nova Energy Corp', price: 85.50, volatility: 0.025, sector: 'Energy' },
  { symbol: 'ZETA', name: 'Zeta Financial', price: 220.75, volatility: 0.018, sector: 'Finance' },
  { symbol: 'LUNA', name: 'Luna Pharmaceuticals', price: 95.20, volatility: 0.03, sector: 'Healthcare' },
  { symbol: 'VEGA', name: 'Vega Manufacturing', price: 125.80, volatility: 0.022, sector: 'Industrial' },
  { symbol: 'ORION', name: 'Orion Retail Group', price: 68.40, volatility: 0.028, sector: 'Consumer' }
];

export const useMarketData = create<MarketState>()(
  subscribeWithSelector((set, get) => ({
    stocks: [],
    isConnected: false,
    lastUpdate: 0,

    initializeStocks: () => {
      const stocks: Stock[] = INITIAL_STOCKS.map(stock => ({
        ...stock,
        priceHistory: [stock.price]
      }));
      
      set({ stocks });
    },

    connectToMarket: () => {
      const state = get();
      if (state.stocks.length === 0) {
        state.initializeStocks();
      }
      
      set({ isConnected: true });
      
      // Start market simulation
      const simulate = () => {
        const currentStocks = get().stocks;
        
        const updatedStocks = currentStocks.map(stock => {
          // Random walk with volatility
          const randomChange = (Math.random() - 0.5) * 2; // -1 to 1
          const priceChange = stock.price * stock.volatility * randomChange;
          const newPrice = Math.max(1, stock.price + priceChange);
          
          // Keep history manageable (last 100 points)
          const newHistory = [...stock.priceHistory, newPrice];
          if (newHistory.length > 100) {
            newHistory.shift();
          }
          
          return {
            ...stock,
            price: newPrice,
            priceHistory: newHistory
          };
        });
        
        set({ 
          stocks: updatedStocks, 
          lastUpdate: Date.now() 
        });
        
        // Continue simulation if still connected
        if (get().isConnected) {
          setTimeout(simulate, 1000); // Update every second
        }
      };
      
      // Start the simulation
      simulate();
    },

    updateStock: (symbol: string, price: number) => {
      const state = get();
      const updatedStocks = state.stocks.map(stock => {
        if (stock.symbol === symbol) {
          const newHistory = [...stock.priceHistory, price];
          if (newHistory.length > 100) {
            newHistory.shift();
          }
          
          return {
            ...stock,
            price,
            priceHistory: newHistory
          };
        }
        return stock;
      });
      
      set({ stocks: updatedStocks });
    },

    getStockPrice: (symbol: string) => {
      const stock = get().stocks.find(s => s.symbol === symbol);
      return stock ? stock.price : 0;
    }
  }))
);

// Make market data available globally for other components
declare global {
  interface Window {
    marketData?: {
      getStockPrice: (symbol: string) => number;
    };
  }
}

// Initialize global reference
if (typeof window !== 'undefined') {
  window.marketData = {
    getStockPrice: (symbol: string) => useMarketData.getState().getStockPrice(symbol)
  };
}
