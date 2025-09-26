import type { Express } from "express";
import { createServer, type Server } from "http";
import { gameServer } from "./gameServer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game API routes
  app.get("/api/game/status", (req, res) => {
    res.json({
      status: "running",
      version: "1.0.0",
      timestamp: Date.now()
    });
  });

  app.get("/api/market/stocks", (req, res) => {
    // Return basic stock data
    const stocks = [
      { symbol: 'APEX', name: 'Apex Technologies', price: 150.00, sector: 'Technology' },
      { symbol: 'NOVA', name: 'Nova Energy Corp', price: 85.50, sector: 'Energy' },
      { symbol: 'ZETA', name: 'Zeta Financial', price: 220.75, sector: 'Finance' },
      { symbol: 'LUNA', name: 'Luna Pharmaceuticals', price: 95.20, sector: 'Healthcare' },
      { symbol: 'VEGA', name: 'Vega Manufacturing', price: 125.80, sector: 'Industrial' },
      { symbol: 'ORION', name: 'Orion Retail Group', price: 68.40, sector: 'Consumer' }
    ];
    
    res.json({ stocks, timestamp: Date.now() });
  });

  app.post("/api/game/trade", (req, res) => {
    const { symbol, shares, action } = req.body;
    
    // Basic validation
    if (!symbol || !shares || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    if (!['buy', 'sell'].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }
    
    // Simulate trade execution
    const mockPrice = 100 + Math.random() * 100;
    const totalValue = mockPrice * shares;
    
    res.json({
      success: true,
      trade: {
        symbol,
        shares,
        action,
        price: mockPrice,
        totalValue,
        timestamp: Date.now()
      }
    });
  });

  app.post("/api/company/create", (req, res) => {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Company name is required" });
    }
    
    // Simulate company creation
    res.json({
      success: true,
      company: {
        id: 'comp_' + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        value: 50000,
        employees: [],
        created: Date.now()
      }
    });
  });

  app.get("/api/contacts", (req, res) => {
    // Return initial contacts
    const contacts = [
      {
        id: 'sarah',
        name: 'Sarah Chen',
        role: 'Investment Banker',
        netWorth: 2500000,
        loyalty: 75,
        influence: 60,
        relationship: 'ally'
      },
      {
        id: 'marcus',
        name: 'Marcus Rodriguez',
        role: 'Hedge Fund Manager',
        netWorth: 15000000,
        loyalty: 45,
        influence: 85,
        relationship: 'neutral'
      },
      {
        id: 'alexandra',
        name: 'Alexandra Volkov',
        role: 'Corporate Lawyer',
        netWorth: 1200000,
        loyalty: 90,
        influence: 40,
        relationship: 'ally'
      },
      {
        id: 'david',
        name: 'David Sterling',
        role: 'Media Mogul',
        netWorth: 50000000,
        loyalty: 20,
        influence: 95,
        relationship: 'rival'
      },
      {
        id: 'elena',
        name: 'Elena Petrov',
        role: 'Government Regulator',
        netWorth: 800000,
        loyalty: 60,
        influence: 70,
        relationship: 'neutral'
      }
    ];
    
    res.json({ contacts, timestamp: Date.now() });
  });

  app.post("/api/legal/lawsuit", (req, res) => {
    const { action, lawsuitId } = req.body;
    
    if (!action || !lawsuitId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    if (action === 'settle') {
      res.json({
        success: true,
        result: 'settled',
        amount: 50000 + Math.random() * 200000,
        message: 'Lawsuit settled out of court'
      });
    } else if (action === 'trial') {
      const won = Math.random() > 0.5;
      res.json({
        success: true,
        result: won ? 'won' : 'lost',
        amount: won ? 0 : 100000 + Math.random() * 500000,
        message: won ? 'Won the trial!' : 'Lost the case and must pay penalty'
      });
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: Date.now(),
      uptime: process.uptime()
    });
  });

  const httpServer = createServer(app);
  
  // Initialize game server with WebSocket support
  gameServer.initialize(httpServer);

  return httpServer;
}
