export interface GamePlayer {
  id: string;
  name: string;
  cash: number;
  netWorth: number;
  portfolio: Record<string, number>; // symbol -> shares
  reputation: number;
  legalRisk: number;
}

export interface GameStock {
  symbol: string;
  name: string;
  price: number;
  priceHistory: number[];
  volatility: number;
  sector: string;
  marketCap?: number;
  volume?: number;
}

export interface GameContact {
  id: string;
  name: string;
  role: string;
  netWorth: number;
  loyalty: number;
  influence: number;
  relationship: 'ally' | 'neutral' | 'rival';
  currentProblem?: string;
  personality: {
    greed: number;
    trustworthiness: number;
    ambition: number;
  };
}

export interface GameEmployee {
  id: string;
  name: string;
  role: 'analyst' | 'trader' | 'lawyer' | 'manager' | 'compliance';
  competence: number;
  loyalty: number;
  salary: number;
  hireDate: number;
  experience: number;
}

export interface GameCompany {
  id: string;
  name: string;
  value: number;
  employees: GameEmployee[];
  performance: number;
  reputation: number;
  cashFlow: number;
  assets: number;
  founded: number;
}

export interface GameLawsuit {
  id: string;
  type: 'insider_trading' | 'market_manipulation' | 'securities_fraud' | 'breach_of_duty';
  plaintiff: string;
  description: string;
  settlementAmount: number;
  maxPenalty: number;
  winProbability: number;
  status: 'pending' | 'settled' | 'trial' | 'dismissed';
  filed: number;
  evidence: string[];
}

export interface GameEvent {
  id: string;
  type: 'market_crash' | 'sector_boom' | 'regulatory_change' | 'merger_announcement' | 'earnings_surprise';
  title: string;
  description: string;
  impact: {
    stocks?: Record<string, number>; // symbol -> percentage change
    sectors?: Record<string, number>; // sector -> percentage change
    legalRisk?: number;
    marketVolatility?: number;
  };
  timestamp: number;
  duration?: number; // How long the effect lasts in seconds
}

export interface GameState {
  player: GamePlayer;
  company?: GameCompany;
  contacts: GameContact[];
  lawsuits: GameLawsuit[];
  events: GameEvent[];
  marketData: {
    stocks: GameStock[];
    lastUpdate: number;
    marketStatus: 'open' | 'closed' | 'pre_market' | 'after_hours';
  };
  gameSettings: {
    difficulty: 'easy' | 'normal' | 'hard';
    timeMultiplier: number; // How fast time passes
    enableEvents: boolean;
    enableMultiplayer: boolean;
  };
}

export interface TradeAction {
  type: 'buy' | 'sell';
  symbol: string;
  shares: number;
  orderType: 'market' | 'limit';
  limitPrice?: number;
  timestamp: number;
}

export interface TradeResult {
  success: boolean;
  trade?: {
    symbol: string;
    shares: number;
    price: number;
    totalValue: number;
    fees: number;
    timestamp: number;
  };
  error?: string;
  newCash?: number;
  newPortfolio?: Record<string, number>;
}

export interface ContactAction {
  type: 'request_favor' | 'help_contact' | 'make_deal' | 'sabotage';
  contactId: string;
  favorType?: 'money' | 'information' | 'influence' | 'introduction';
  amount?: number;
  details?: string;
}

export interface ContactResponse {
  success: boolean;
  response: string;
  loyaltyChange?: number;
  cashChange?: number;
  informationGained?: string;
  newContact?: GameContact;
  consequences?: string[];
}

export interface CompanyAction {
  type: 'hire' | 'fire' | 'promote' | 'train' | 'expand' | 'restructure';
  employeeId?: string;
  role?: string;
  department?: string;
  amount?: number;
}

export interface LegalAction {
  type: 'settle' | 'trial' | 'hire_lawyer' | 'file_motion' | 'negotiate';
  lawsuitId?: string;
  amount?: number;
  strategy?: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface MarketUpdate extends WebSocketMessage {
  type: 'market_update';
  data: {
    symbol: string;
    price: number;
    volume: number;
    change: number;
  };
}

export interface NewsEvent extends WebSocketMessage {
  type: 'news_event';
  data: GameEvent;
}

export interface PlayerUpdate extends WebSocketMessage {
  type: 'player_update';
  data: Partial<GamePlayer>;
}

// Utility types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface GameApiEndpoints {
  '/api/game/status': { GET: ApiResponse<{ status: string; version: string }> };
  '/api/market/stocks': { GET: ApiResponse<{ stocks: GameStock[] }> };
  '/api/game/trade': { POST: { body: TradeAction; response: ApiResponse<TradeResult> } };
  '/api/company/create': { POST: { body: { name: string }; response: ApiResponse<GameCompany> } };
  '/api/contacts': { GET: ApiResponse<{ contacts: GameContact[] }> };
  '/api/legal/lawsuit': { POST: { body: LegalAction; response: ApiResponse<any> } };
  '/api/health': { GET: ApiResponse<{ status: string; uptime: number }> };
}
