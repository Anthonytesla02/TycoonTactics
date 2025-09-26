import { useState } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Building, Users, DollarSign, TrendingUp, Plus } from "lucide-react";

export function CompanyManager() {
  const { player, company, createCompany, hireEmployee, upgradeEmployee } = useGameState();
  const [companyName, setCompanyName] = useState("");

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
            <Button
              size="sm"
              onClick={() => hireEmployee()}
              disabled={player.cash < 25000}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Hire ($25k)
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {company.employees.length === 0 ? (
            <p className="text-gray-400">No employees yet. Hire your first team member!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.employees.map((employee) => (
                <div key={employee.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold">{employee.name}</div>
                      <div className="text-sm text-gray-400">{employee.role}</div>
                    </div>
                    <Badge variant={
                      employee.loyalty >= 80 ? 'default' :
                      employee.loyalty >= 50 ? 'secondary' : 'destructive'
                    }>
                      {employee.loyalty}% Loyal
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Competence:</span>
                      <span>{employee.competence}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Salary:</span>
                      <span>${employee.salary.toLocaleString()}/month</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => upgradeEmployee(employee.id, 'competence')}
                      disabled={player.cash < 5000}
                      variant="outline"
                    >
                      Train ($5k)
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => upgradeEmployee(employee.id, 'salary')}
                      disabled={player.cash < 2000}
                      variant="outline"
                    >
                      Raise ($2k)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
