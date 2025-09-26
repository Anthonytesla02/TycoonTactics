import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, Circle, ChevronRight, ChevronDown, Target } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'core' | 'advanced' | 'endgame';
}

const TASKS: Task[] = [
  // Core MVP Features (Completed in this implementation)
  {
    id: 'dashboard',
    title: 'Player Dashboard with $100K Starting Bankroll',
    description: 'Create main dashboard showing cash, portfolio, and net worth',
    completed: true,
    category: 'core'
  },
  {
    id: 'market-sim',
    title: 'Stock Market Simulation with Live Charts',
    description: 'Implement random walk algorithm for realistic price movements',
    completed: true,
    category: 'core'
  },
  {
    id: 'trading',
    title: 'Basic Buy/Sell Investment System',
    description: 'Allow players to buy and sell stocks with immediate P&L',
    completed: true,
    category: 'core'
  },
  {
    id: 'contacts',
    title: 'Contact Network with 5 AI Characters',
    description: 'Create friends, rivals, and business partners with AI personalities',
    completed: true,
    category: 'core'
  },
  {
    id: 'company',
    title: 'Company Creation System',
    description: 'Allow player to start their own hedge fund',
    completed: true,
    category: 'core'
  },
  {
    id: 'realtime',
    title: 'Real-time Price Updates Every Second',
    description: 'WebSocket-based live market data streaming',
    completed: true,
    category: 'core'
  },
  {
    id: 'legal-risk',
    title: 'Legal Risk Meter',
    description: 'Track legal risk from aggressive trading',
    completed: true,
    category: 'core'
  },
  {
    id: 'lawsuits',
    title: 'Basic Lawsuit System',
    description: 'Settle vs trial mechanics for legal disputes',
    completed: true,
    category: 'core'
  },
  {
    id: 'ui-design',
    title: 'Clean Financial Dashboard UI',
    description: 'Dark theme with live updating charts and professional layout',
    completed: true,
    category: 'core'
  },
  {
    id: 'task-tracking',
    title: 'Task Completion Tracking System',
    description: 'This component for tracking development progress',
    completed: true,
    category: 'core'
  },

  // Advanced Features (To be implemented)
  {
    id: 'employee-management',
    title: 'Advanced Employee Management',
    description: 'Hire analysts, traders, lawyers with upgradeable skills',
    completed: false,
    category: 'advanced'
  },
  {
    id: 'insider-trading',
    title: 'Insider Trading Mechanics',
    description: 'Tip-offs and information trading system',
    completed: false,
    category: 'advanced'
  },
  {
    id: 'market-sectors',
    title: 'Multiple Market Sectors',
    description: 'Tech, healthcare, energy sectors with correlations',
    completed: false,
    category: 'advanced'
  },
  {
    id: 'news-events',
    title: 'Dynamic News Events',
    description: 'Random market-moving events and crises',
    completed: false,
    category: 'advanced'
  },
  {
    id: 'partnerships',
    title: 'Business Partnerships',
    description: 'Form alliances and joint ventures with contacts',
    completed: false,
    category: 'advanced'
  },
  {
    id: 'competitor-ai',
    title: 'Advanced Competitor AI',
    description: 'AI tycoons that actively compete and adapt',
    completed: false,
    category: 'advanced'
  },
  {
    id: 'media-system',
    title: 'Media and Reputation System',
    description: 'Public image affects business opportunities',
    completed: false,
    category: 'advanced'
  },
  {
    id: 'regulatory-system',
    title: 'Complex Regulatory System',
    description: 'SEC investigations and government relations',
    completed: false,
    category: 'advanced'
  },

  // Endgame Features
  {
    id: 'ipo-system',
    title: 'IPO and Public Company Management',
    description: 'Take company public and manage shareholders',
    completed: false,
    category: 'endgame'
  },
  {
    id: 'global-markets',
    title: 'International Markets',
    description: 'Forex, commodities, and global expansion',
    completed: false,
    category: 'endgame'
  },
  {
    id: 'political-influence',
    title: 'Political Influence System',
    description: 'Lobby government and influence policy',
    completed: false,
    category: 'endgame'
  },
  {
    id: 'multiplayer',
    title: 'Multiplayer Support',
    description: 'Real-time multiplayer competition',
    completed: false,
    category: 'endgame'
  },
  {
    id: 'scenario-mode',
    title: 'Scenario Campaign Mode',
    description: 'Historical events like 2008 crash, dot-com bubble',
    completed: false,
    category: 'endgame'
  }
];

export function TaskTracker() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'advanced' | 'endgame'>('all');

  const filteredTasks = selectedCategory === 'all' 
    ? TASKS 
    : TASKS.filter(task => task.category === selectedCategory);

  const completedCount = TASKS.filter(task => task.completed).length;
  const totalCount = TASKS.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const getCategoryStats = (category: 'core' | 'advanced' | 'endgame') => {
    const categoryTasks = TASKS.filter(task => task.category === category);
    const completed = categoryTasks.filter(task => task.completed).length;
    return { completed, total: categoryTasks.length };
  };

  const coreStats = getCategoryStats('core');
  const advancedStats = getCategoryStats('advanced');
  const endgameStats = getCategoryStats('endgame');

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Target className="w-4 h-4 mr-2" />
          Tasks ({completedCount}/{totalCount})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 z-50">
      <Card className="bg-gray-800 border-gray-700 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Development Progress
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CardTitle>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={selectedCategory === 'core' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('core')}
              >
                Core ({coreStats.completed}/{coreStats.total})
              </Button>
              <Button
                size="sm"
                variant={selectedCategory === 'advanced' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('advanced')}
              >
                Advanced ({advancedStats.completed}/{advancedStats.total})
              </Button>
              <Button
                size="sm"
                variant={selectedCategory === 'endgame' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('endgame')}
              >
                Endgame ({endgameStats.completed}/{endgameStats.total})
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border ${
                  task.completed 
                    ? 'bg-green-900/20 border-green-600' 
                    : 'bg-gray-700 border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`font-medium text-sm ${
                        task.completed ? 'text-green-400' : 'text-white'
                      }`}>
                        {task.title}
                      </div>
                      <Badge 
                        variant={
                          task.category === 'core' ? 'default' :
                          task.category === 'advanced' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {task.category}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      {task.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
