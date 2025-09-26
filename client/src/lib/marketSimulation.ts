/**
 * Random Walk Market Simulation
 * Implements realistic price movements using Brownian motion
 */

export interface MarketConfig {
  volatility: number;
  drift: number; // Long-term trend
  meanReversion: number; // Tendency to return to mean
}

export class RandomWalkSimulation {
  private basePrice: number;
  private currentPrice: number;
  private config: MarketConfig;
  private priceHistory: number[] = [];

  constructor(basePrice: number, config: MarketConfig) {
    this.basePrice = basePrice;
    this.currentPrice = basePrice;
    this.config = config;
    this.priceHistory = [basePrice];
  }

  /**
   * Generate next price using random walk with mean reversion
   */
  generateNextPrice(): number {
    // Random component (Brownian motion)
    const randomShock = this.generateRandomShock();
    
    // Mean reversion component
    const meanReversionForce = this.config.meanReversion * (this.basePrice - this.currentPrice) / this.basePrice;
    
    // Combine components
    const priceChange = (this.config.drift + meanReversionForce + randomShock) * this.currentPrice;
    
    // Update price (ensure it doesn't go negative)
    this.currentPrice = Math.max(0.01, this.currentPrice + priceChange);
    
    // Update history
    this.priceHistory.push(this.currentPrice);
    
    // Keep history manageable
    if (this.priceHistory.length > 1000) {
      this.priceHistory.shift();
    }
    
    return this.currentPrice;
  }

  /**
   * Generate random shock using Box-Muller transform for normal distribution
   */
  private generateRandomShock(): number {
    // Box-Muller transform to generate normally distributed random numbers
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return z0 * this.config.volatility;
  }

  /**
   * Simulate market events that cause significant price movements
   */
  simulateMarketEvent(eventType: 'crash' | 'boom' | 'news'): number {
    let impactMultiplier = 1;
    
    switch (eventType) {
      case 'crash':
        impactMultiplier = -0.15 - Math.random() * 0.10; // -15% to -25%
        break;
      case 'boom':
        impactMultiplier = 0.10 + Math.random() * 0.15; // +10% to +25%
        break;
      case 'news':
        impactMultiplier = (Math.random() - 0.5) * 0.10; // -5% to +5%
        break;
    }
    
    const priceChange = this.currentPrice * impactMultiplier;
    this.currentPrice = Math.max(0.01, this.currentPrice + priceChange);
    this.priceHistory.push(this.currentPrice);
    
    return this.currentPrice;
  }

  /**
   * Get current price
   */
  getCurrentPrice(): number {
    return this.currentPrice;
  }

  /**
   * Get price history
   */
  getPriceHistory(): number[] {
    return [...this.priceHistory];
  }

  /**
   * Calculate price volatility over recent history
   */
  calculateVolatility(periods: number = 20): number {
    if (this.priceHistory.length < periods + 1) {
      return this.config.volatility;
    }

    const recentPrices = this.priceHistory.slice(-periods);
    const returns = [];
    
    for (let i = 1; i < recentPrices.length; i++) {
      const returnRate = Math.log(recentPrices[i] / recentPrices[i - 1]);
      returns.push(returnRate);
    }
    
    // Calculate standard deviation of returns
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  /**
   * Reset simulation to base price
   */
  reset(): void {
    this.currentPrice = this.basePrice;
    this.priceHistory = [this.basePrice];
  }
}

/**
 * Create market simulation for different sectors
 */
export function createSectorSimulations(): Record<string, MarketConfig> {
  return {
    Technology: {
      volatility: 0.025,
      drift: 0.0002, // Slight positive trend
      meanReversion: 0.001
    },
    Energy: {
      volatility: 0.030,
      drift: 0.0001,
      meanReversion: 0.002
    },
    Finance: {
      volatility: 0.020,
      drift: 0.0001,
      meanReversion: 0.0015
    },
    Healthcare: {
      volatility: 0.022,
      drift: 0.0003,
      meanReversion: 0.001
    },
    Industrial: {
      volatility: 0.018,
      drift: 0.0001,
      meanReversion: 0.002
    },
    Consumer: {
      volatility: 0.025,
      drift: 0.0002,
      meanReversion: 0.0018
    }
  };
}

/**
 * Generate correlated price movements between stocks in the same sector
 */
export function generateCorrelatedMovement(
  stockPrices: Record<string, number>,
  stockSectors: Record<string, string>,
  correlationStrength: number = 0.3
): Record<string, number> {
  const sectorMovements: Record<string, number> = {};
  const updatedPrices: Record<string, number> = {};
  
  // Generate sector-wide movements
  const sectors = Object.values(stockSectors);
  const uniqueSectors = [...new Set(sectors)];
  
  uniqueSectors.forEach(sector => {
    sectorMovements[sector] = (Math.random() - 0.5) * 0.02; // -1% to +1%
  });
  
  // Apply correlated movements
  Object.entries(stockPrices).forEach(([symbol, price]) => {
    const sector = stockSectors[symbol];
    const sectorMovement = sectorMovements[sector] || 0;
    const individualMovement = (Math.random() - 0.5) * 0.015; // Individual component
    
    const totalMovement = (correlationStrength * sectorMovement) + 
                         ((1 - correlationStrength) * individualMovement);
    
    updatedPrices[symbol] = Math.max(0.01, price * (1 + totalMovement));
  });
  
  return updatedPrices;
}
