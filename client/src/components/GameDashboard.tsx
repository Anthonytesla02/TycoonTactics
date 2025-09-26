import { useState } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { useMarketData } from "../lib/stores/useMarketData";
import { StockChart } from "./StockChart";
import { ContactNetwork } from "./ContactNetwork";
import { CompanyManager } from "./CompanyManager";
import { LegalSystem } from "./LegalSystem";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, Users, Building, Scale, AlertTriangle } from "lucide-react";

export function GameDashboard() {
  const { 
    player, 
    selectedStock, 
    selectStock, 
    buyStock, 
    sellStock,
    legalRisk 
  } = useGameState();
  
  const { stocks, getStockPrice } = useMarketData();
  const [activeTab, setActiveTab] = useState("portfolio");

  const netWorth = player.cash + Object.entries(player.portfolio).reduce((total, [symbol, shares]) => {
    return total + (shares * getStockPrice(symbol));
  }, 0);

  const portfolioValue = Object.entries(player.portfolio).reduce((total, [symbol, shares]) => {
    return total + (shares * getStockPrice(symbol));
  }, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${netWorth.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              ${player.cash.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              ${portfolioValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Legal Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {legalRisk}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${legalRisk}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Market
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Legal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Holdings */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(player.portfolio).length === 0 ? (
                    <p className="text-gray-400">No holdings yet. Start investing!</p>
                  ) : (
                    Object.entries(player.portfolio).map(([symbol, shares]: [string, number]) => {
                      const currentPrice = getStockPrice(symbol);
                      const value = (shares as number) * currentPrice;
                      const stock = stocks.find((s: any) => s.symbol === symbol);
                      
                      return (
                        <div key={symbol} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                          <div>
                            <div className="font-semibold">{symbol}</div>
                            <div className="text-sm text-gray-400">{shares as number} shares</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${value.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">${currentPrice.toFixed(2)}/share</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stock Chart */}
            {selectedStock && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>{selectedStock} Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <StockChart symbol={selectedStock} />
                  <div className="mt-4 flex gap-2">
                    <Button 
                      onClick={() => buyStock(selectedStock, 10)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={player.cash < getStockPrice(selectedStock) * 10}
                    >
                      Buy 10 Shares
                    </Button>
                    <Button 
                      onClick={() => sellStock(selectedStock, 10)}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={(player.portfolio[selectedStock] || 0) < 10}
                    >
                      Sell 10 Shares
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Stock Market</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stocks.map((stock: any) => {
                  const isSelected = selectedStock === stock.symbol;
                  const priceChange = stock.priceHistory.length > 1 
                    ? stock.price - stock.priceHistory[stock.priceHistory.length - 2]
                    : 0;
                  const changePercent = stock.priceHistory.length > 1
                    ? (priceChange / stock.priceHistory[stock.priceHistory.length - 2]) * 100
                    : 0;

                  return (
                    <div
                      key={stock.symbol}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-400' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => selectStock(stock.symbol)}
                    >
                      <div className="font-semibold text-lg">{stock.symbol}</div>
                      <div className="text-sm text-gray-300 mb-2">{stock.name}</div>
                      <div className="text-xl font-bold">${stock.price.toFixed(2)}</div>
                      <div className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <ContactNetwork />
        </TabsContent>

        <TabsContent value="company">
          <CompanyManager />
        </TabsContent>

        <TabsContent value="legal">
          <LegalSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
}
