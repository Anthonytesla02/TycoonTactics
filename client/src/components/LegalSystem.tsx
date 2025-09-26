import { useGameState } from "../lib/stores/useGameState";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertTriangle, Scale, DollarSign, Gavel } from "lucide-react";

export function LegalSystem() {
  const { legalRisk, lawsuits, settleLawsuit, goToTrial, player } = useGameState();

  const getRiskLevel = (risk: number) => {
    if (risk < 25) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-400' };
    if (risk < 50) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (risk < 75) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-400' };
    return { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  const riskInfo = getRiskLevel(legalRisk);

  return (
    <div className="space-y-6">
      {/* Legal Risk Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Legal Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Current Risk Level</span>
              </div>
              <div className={`text-2xl font-bold ${riskInfo.textColor} mb-3`}>
                {riskInfo.level} ({legalRisk}%)
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`${riskInfo.color} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${legalRisk}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-400">Risk Factors:</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Aggressive Trading:</span>
                  <span className={legalRisk > 30 ? 'text-red-400' : 'text-green-400'}>
                    {legalRisk > 30 ? 'High' : 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insider Trading:</span>
                  <span className={legalRisk > 50 ? 'text-red-400' : 'text-green-400'}>
                    {legalRisk > 50 ? 'Suspected' : 'Clean'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Market Manipulation:</span>
                  <span className={legalRisk > 70 ? 'text-red-400' : 'text-green-400'}>
                    {legalRisk > 70 ? 'Under Investigation' : 'Clear'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {legalRisk > 80 && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-600 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="font-semibold text-red-400">WARNING</span>
              </div>
              <p className="text-sm text-red-300">
                Your activities are under heavy scrutiny. Any further suspicious trades may result in immediate legal action.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Lawsuits */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="w-5 h-5" />
            Active Legal Cases ({lawsuits.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lawsuits.length === 0 ? (
            <p className="text-gray-400">No active lawsuits. Keep it clean!</p>
          ) : (
            <div className="space-y-4">
              {lawsuits.map((lawsuit: any) => (
                <div key={lawsuit.id} className="p-4 bg-gray-700 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-red-400">{lawsuit.type}</div>
                      <div className="text-sm text-gray-400">Filed by: {lawsuit.plaintiff}</div>
                    </div>
                    <Badge variant="destructive">
                      {lawsuit.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{lawsuit.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <div className="text-xs text-gray-400">Settlement Amount</div>
                      <div className="font-semibold text-yellow-400">
                        ${lawsuit.settlementAmount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Potential Fine</div>
                      <div className="font-semibold text-red-400">
                        ${lawsuit.maxPenalty.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Win Probability</div>
                      <div className="font-semibold text-blue-400">
                        {lawsuit.winProbability}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => settleLawsuit(lawsuit.id)}
                      disabled={player.cash < lawsuit.settlementAmount}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Settle (${lawsuit.settlementAmount.toLocaleString()})
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => goToTrial(lawsuit.id)}
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                    >
                      <Scale className="w-4 h-4 mr-1" />
                      Go to Trial ({lawsuit.winProbability}% win)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Services */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Legal Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="font-semibold mb-2">Hire Better Lawyers</div>
              <div className="text-sm text-gray-400 mb-3">
                Improve your trial win rate and reduce settlement costs.
              </div>
              <div className="text-lg font-bold text-green-400 mb-3">$100,000</div>
              <Button
                size="sm"
                disabled={player.cash < 100000}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Upgrade Legal Team
              </Button>
            </div>
            
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="font-semibold mb-2">Compliance Consultant</div>
              <div className="text-sm text-gray-400 mb-3">
                Reduce legal risk accumulation from trading activities.
              </div>
              <div className="text-lg font-bold text-green-400 mb-3">$50,000</div>
              <Button
                size="sm"
                disabled={player.cash < 50000}
                className="bg-green-600 hover:bg-green-700"
              >
                Hire Consultant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
