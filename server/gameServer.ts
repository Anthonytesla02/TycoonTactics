import { WebSocket, WebSocketServer } from 'ws';
import type { Server } from 'http';

interface GameClient {
  id: string;
  ws: WebSocket;
  playerId?: string;
}

class GameServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, GameClient> = new Map();
  private marketTicker: NodeJS.Timeout | null = null;

  initialize(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = this.generateClientId();
      const client: GameClient = { id: clientId, ws };
      
      this.clients.set(clientId, client);
      console.log(`Game client connected: ${clientId}`);
      
      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connected',
        clientId,
        message: 'Connected to Financial Tycoon game server'
      });
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('Invalid JSON from client:', error);
        }
      });
      
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`Game client disconnected: ${clientId}`);
      });
      
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });
    
    // Start market simulation
    this.startMarketSimulation();
    
    console.log('Game server initialized with WebSocket support');
  }

  private generateClientId(): string {
    return 'client_' + Math.random().toString(36).substr(2, 9);
  }

  private handleClientMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    switch (message.type) {
      case 'player_action':
        this.handlePlayerAction(clientId, message.action);
        break;
        
      case 'market_request':
        this.sendMarketData(clientId);
        break;
        
      case 'ping':
        this.sendToClient(clientId, { type: 'pong', timestamp: Date.now() });
        break;
        
      default:
        console.log(`Unknown message type from ${clientId}:`, message.type);
    }
  }

  private handlePlayerAction(clientId: string, action: any) {
    // Handle player actions like trades, company management, etc.
    switch (action.type) {
      case 'trade':
        this.processTradeAction(clientId, action);
        break;
        
      case 'hire_employee':
        this.processHireAction(clientId, action);
        break;
        
      default:
        console.log(`Unknown player action from ${clientId}:`, action.type);
    }
  }

  private processTradeAction(clientId: string, action: any) {
    // Simulate trade processing and send confirmation
    const tradeResult = {
      type: 'trade_result',
      success: true,
      symbol: action.symbol,
      shares: action.shares,
      price: action.price,
      timestamp: Date.now()
    };
    
    this.sendToClient(clientId, tradeResult);
  }

  private processHireAction(clientId: string, action: any) {
    // Simulate employee hiring
    const hireResult = {
      type: 'hire_result',
      success: true,
      employee: {
        id: 'emp_' + Math.random().toString(36).substr(2, 9),
        name: action.name || 'New Employee',
        role: action.role || 'Analyst',
        competence: 50 + Math.floor(Math.random() * 30),
        loyalty: 60 + Math.floor(Math.random() * 30)
      },
      timestamp: Date.now()
    };
    
    this.sendToClient(clientId, hireResult);
  }

  private startMarketSimulation() {
    if (this.marketTicker) {
      clearInterval(this.marketTicker);
    }
    
    // Stock symbols and their base data
    const stocks = [
      { symbol: 'APEX', basePrice: 150.00, volatility: 0.02 },
      { symbol: 'NOVA', basePrice: 85.50, volatility: 0.025 },
      { symbol: 'ZETA', basePrice: 220.75, volatility: 0.018 },
      { symbol: 'LUNA', basePrice: 95.20, volatility: 0.03 },
      { symbol: 'VEGA', basePrice: 125.80, volatility: 0.022 },
      { symbol: 'ORION', basePrice: 68.40, volatility: 0.028 }
    ];
    
    // Initialize stock prices
    const stockPrices: Record<string, number> = {};
    stocks.forEach(stock => {
      stockPrices[stock.symbol] = stock.basePrice;
    });
    
    this.marketTicker = setInterval(() => {
      // Update stock prices using random walk
      stocks.forEach(stock => {
        const randomChange = (Math.random() - 0.5) * 2; // -1 to 1
        const priceChange = stockPrices[stock.symbol] * stock.volatility * randomChange;
        stockPrices[stock.symbol] = Math.max(1, stockPrices[stock.symbol] + priceChange);
        
        // Broadcast price update to all clients
        this.broadcastToAll({
          type: 'market_update',
          symbol: stock.symbol,
          price: stockPrices[stock.symbol],
          timestamp: Date.now()
        });
      });
      
      // Occasionally generate market events
      if (Math.random() < 0.01) { // 1% chance per tick
        this.generateMarketEvent(stocks, stockPrices);
      }
      
    }, 1000); // Update every second
  }

  private generateMarketEvent(stocks: any[], stockPrices: Record<string, number>) {
    const eventTypes = ['news', 'earnings', 'merger_rumor', 'regulatory'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const affectedStock = stocks[Math.floor(Math.random() * stocks.length)];
    
    // Generate price impact
    const impactRange = eventType === 'merger_rumor' ? 0.15 : 0.08;
    const impact = (Math.random() - 0.5) * impactRange;
    
    stockPrices[affectedStock.symbol] *= (1 + impact);
    stockPrices[affectedStock.symbol] = Math.max(1, stockPrices[affectedStock.symbol]);
    
    // Broadcast market event
    this.broadcastToAll({
      type: 'market_event',
      eventType,
      symbol: affectedStock.symbol,
      impact: impact * 100, // Convert to percentage
      description: this.generateEventDescription(eventType, affectedStock.symbol, impact),
      timestamp: Date.now()
    });
  }

  private generateEventDescription(eventType: string, symbol: string, impact: number): string {
    const direction = impact > 0 ? 'positive' : 'negative';
    
    switch (eventType) {
      case 'news':
        return `Breaking news affects ${symbol} stock with ${direction} sentiment`;
      case 'earnings':
        return `${symbol} reports ${impact > 0 ? 'better' : 'worse'} than expected earnings`;
      case 'merger_rumor':
        return `Merger rumors surrounding ${symbol} cause ${direction} market reaction`;
      case 'regulatory':
        return `Regulatory update impacts ${symbol} and related companies`;
      default:
        return `Market event affects ${symbol}`;
    }
  }

  private sendMarketData(clientId: string) {
    // Send current market snapshot
    const marketSnapshot = {
      type: 'market_snapshot',
      stocks: [
        { symbol: 'APEX', price: 150.00 + (Math.random() - 0.5) * 10 },
        { symbol: 'NOVA', price: 85.50 + (Math.random() - 0.5) * 5 },
        { symbol: 'ZETA', price: 220.75 + (Math.random() - 0.5) * 15 },
        { symbol: 'LUNA', price: 95.20 + (Math.random() - 0.5) * 8 },
        { symbol: 'VEGA', price: 125.80 + (Math.random() - 0.5) * 12 },
        { symbol: 'ORION', price: 68.40 + (Math.random() - 0.5) * 6 }
      ],
      timestamp: Date.now()
    };
    
    this.sendToClient(clientId, marketSnapshot);
  }

  private sendToClient(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to send message to client ${clientId}:`, error);
      }
    }
  }

  private broadcastToAll(data: any) {
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify(data));
        } catch (error) {
          console.error(`Failed to broadcast to client ${client.id}:`, error);
        }
      }
    });
  }

  shutdown() {
    if (this.marketTicker) {
      clearInterval(this.marketTicker);
      this.marketTicker = null;
    }
    
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    
    this.clients.clear();
    console.log('Game server shutdown complete');
  }
}

export const gameServer = new GameServer();
