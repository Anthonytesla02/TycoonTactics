import { useState, useEffect } from "react";
import { useGameState, Employee } from "../lib/stores/useGameState";
import { EmployeeRole, EMPLOYEE_ROLES } from "../../../shared/employeeConfig";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Building, Users, DollarSign, TrendingUp, Plus, Brain, TrendingUp as Trading, Scale, Shield, AlertTriangle, Star, UserX, Gift, AlertCircle } from "lucide-react";

export function CompanyManager() {
  const { player, company, createCompany, hireEmployee, upgradeEmployee, trainEmployee, fireEmployee, giveEmployeeBonus, checkEmployeeBetrayals } = useGameState();
  const [companyName, setCompanyName] = useState("");
  const [selectedRole, setSelectedRole] = useState<EmployeeRole | "random">("random");
  const [showHireOptions, setShowHireOptions] = useState(false);
  const [bonusAmounts, setBonusAmounts] = useState<Record<string, number>>({});

  // Periodic betrayal checks
  useEffect(() => {
    if (!company || company.employees.length === 0) return;
    
    const interval = setInterval(() => {
      checkEmployeeBetrayals();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [company?.employees.length, checkEmployeeBetrayals]);

  const roleIcons = {
    brain: Brain,
    'trending-up': Trading,
    scale: Scale,
    shield: Shield,
    'alert-triangle': AlertTriangle
  };

  if (!company) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Start Your Hedge Fund
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400">
            Create your own hedge fund to unlock advanced investment strategies and hire employees.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Startup Cost:</div>
              <div className="text-xl font-bold text-red-400">$50,000</div>
            </div>
            
            <Button
              onClick={() => createCompany(companyName)}
              disabled={!companyName || player.cash < 50000}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Company ($50,000)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            {company.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Company Value</span>
              </div>
              <div className="text-xl font-bold text-green-400">
                ${company.value.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Employees</span>
              </div>
              <div className="text-xl font-bold text-blue-400">
                {company.employees.length}
              </div>
            </div>
            
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Performance</span>
              </div>
              <div className="text-xl font-bold text-purple-400">
                +{company.performance}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Employees
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setShowHireOptions(!showHireOptions)}
                disabled={player.cash < 25000}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Hire Employee ($25k)
              </Button>
              {company.employees.length > 0 && (
                <Button
                  size="sm"
                  onClick={checkEmployeeBetrayals}
                  variant="outline"
                  className="bg-orange-900 hover:bg-orange-800"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Check Loyalty
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showHireOptions && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Choose Employee Type
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {(Object.entries(EMPLOYEE_ROLES) as [EmployeeRole, any][]).map(([role, config]) => {
                  const Icon = roleIcons[config.icon as keyof typeof roleIcons];
                  return (
                    <Button
                      key={role}
                      variant={selectedRole === role ? "default" : "outline"}
                      onClick={() => setSelectedRole(role)}
                      className="h-auto p-3 flex flex-col items-start text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${config.color}`} />
                        <span className="capitalize font-semibold">{config.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{config.description}</p>
                    </Button>
                  );
                })}
                <Button
                  variant={selectedRole === "random" ? "default" : "outline"}
                  onClick={() => setSelectedRole("random")}
                  className="h-auto p-3 flex flex-col items-start text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">Random</span>
                  </div>
                  <p className="text-xs text-gray-400">Let me choose for you</p>
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    hireEmployee(selectedRole === "random" ? undefined : selectedRole);
                    setShowHireOptions(false);
                  }}
                  disabled={player.cash < 25000}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Hire {selectedRole === "random" ? "Random" : selectedRole.replace('_', ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ($25k)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowHireOptions(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {company.employees.length === 0 ? (
            <p className="text-gray-400">No employees yet. Hire your first team member!</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {company.employees.map((employee: Employee) => {
                const roleConfig = EMPLOYEE_ROLES[employee.role];
                const Icon = roleIcons[roleConfig.icon as keyof typeof roleIcons] || Users;
                return (
                  <div key={employee.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${roleConfig.color}`} />
                          <span className="font-semibold">{employee.name}</span>
                          {employee.loyalty < 20 && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {roleConfig.name} • {employee.specialization}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: employee.skillLevel }, (_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - employee.skillLevel }, (_, i) => (
                            <Star key={i + employee.skillLevel} className="w-3 h-3 text-gray-500" />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">Level {employee.skillLevel}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={
                          employee.loyalty >= 80 ? 'default' :
                          employee.loyalty >= 50 ? 'secondary' : 'destructive'
                        }>
                          {employee.loyalty}% Loyal
                        </Badge>
                        {employee.loyalty < 30 && (
                          <span className="text-xs text-red-400">⚠️ Risk of betrayal</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Competence:</span>
                        <span>{employee.competence}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Performance:</span>
                        <span className={employee.loyalty >= 80 ? 'text-green-400' : employee.loyalty >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                          {Math.round((0.5 + employee.loyalty / 200) * 100)}% efficiency
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Experience:</span>
                        <span>{employee.experience} XP</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Salary:</span>
                        <span>${employee.salary.toLocaleString()}/month</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-1">Abilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {employee.abilities.map((ability, idx) => (
                          <span key={idx} className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                            {ability}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => upgradeEmployee(employee.id, 'competence')}
                        disabled={player.cash < 8000}
                        variant="outline"
                      >
                        Train ($8k)
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => upgradeEmployee(employee.id, 'salary')}
                        disabled={player.cash < 3000}
                        variant="outline"
                      >
                        Raise ($3k)
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => trainEmployee(employee.id, employee.specialization)}
                        disabled={player.cash < 15000}
                        variant="outline"
                        className="bg-purple-900 hover:bg-purple-800"
                      >
                        Specialize ($15k)
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder="Bonus"
                          value={bonusAmounts[employee.id] || ''}
                          onChange={(e) => setBonusAmounts({
                            ...bonusAmounts,
                            [employee.id]: parseInt(e.target.value) || 0
                          })}
                          className="w-20 h-8 text-xs bg-gray-700 border-gray-600"
                          min="1000"
                          step="1000"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const amount = bonusAmounts[employee.id] || 5000;
                            giveEmployeeBonus(employee.id, amount);
                            setBonusAmounts({...bonusAmounts, [employee.id]: 0});
                          }}
                          disabled={player.cash < (bonusAmounts[employee.id] || 1000)}
                          variant="outline"
                          className="h-8 text-xs bg-green-900 hover:bg-green-800"
                        >
                          <Gift className="w-3 h-3 mr-1" />
                          Bonus
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => fireEmployee(employee.id)}
                        disabled={player.cash < employee.salary * 2}
                        variant="outline"
                        className="h-8 text-xs bg-red-900 hover:bg-red-800"
                      >
                        <UserX className="w-3 h-3 mr-1" />
                        Fire (${(employee.salary * 2).toLocaleString()})
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
