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

export interface Contact {
  id: string;
  name: string;
  role: string;
  netWorth: number;
  loyalty: number;
  influence: number;
  relationship: 'ally' | 'neutral' | 'rival';
  currentProblem?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  competence: number;
  loyalty: number;
  salary: number;
  specialization: string;
  experience: number;
  skillLevel: number;
  abilities: string[];
}

import { EmployeeRole, EMPLOYEE_ROLES } from '../../../../shared/employeeConfig';

export interface Company {
  name: string;
  value: number;
  employees: Employee[];
  performance: number;
}

export interface Lawsuit {
  id: string;
  type: string;
  plaintiff: string;
  description: string;
  settlementAmount: number;
  maxPenalty: number;
  winProbability: number;
  status: 'pending' | 'settled' | 'trial';
}

export interface Player {
  cash: number;
  portfolio: Record<string, number>; // symbol -> shares
  reputation: number;
}

interface GameState {
  // Core state
  player: Player;
  company: Company | null;
  contacts: Contact[];
  lawsuits: Lawsuit[];
  legalRisk: number;
  selectedStock: string | null;
  gameStarted: boolean;

  // Actions
  initializeGame: () => void;
  startGame: () => void;
  selectStock: (symbol: string) => void;
  buyStock: (symbol: string, shares: number) => void;
  sellStock: (symbol: string, shares: number) => void;
  createCompany: (name: string) => void;
  hireEmployee: (role?: EmployeeRole) => void;
  upgradeEmployee: (id: string, type: 'competence' | 'salary') => void;
  trainEmployee: (id: string, skill: string) => void;
  getEmployeeBonus: (role: EmployeeRole) => number;
  requestFavor: (contactId: string, type: 'money' | 'info' | 'sabotage') => void;
  helpContact: (contactId: string) => void;
  settleLawsuit: (id: string) => void;
  goToTrial: (id: string) => void;
  increaseLegalRisk: (amount: number) => void;
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'sarah',
    name: 'Sarah Chen',
    role: 'Investment Banker',
    netWorth: 2500000,
    loyalty: 75,
    influence: 60,
    relationship: 'ally',
    currentProblem: 'Need help with a difficult client threatening to pull their funds'
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
    relationship: 'ally',
    currentProblem: 'Rival firm trying to poach her biggest client'
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
    relationship: 'neutral',
    currentProblem: 'Facing pressure from lobbyists on new financial regulations'
  }
];

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    player: {
      cash: 100000,
      portfolio: {},
      reputation: 50
    },
    company: null,
    contacts: INITIAL_CONTACTS,
    lawsuits: [],
    legalRisk: 0,
    selectedStock: null,
    gameStarted: false,

    initializeGame: () => {
      set({
        player: {
          cash: 100000,
          portfolio: {},
          reputation: 50
        },
        company: null,
        contacts: INITIAL_CONTACTS,
        lawsuits: [],
        legalRisk: 0,
        selectedStock: null
      });
    },

    startGame: () => {
      set({ gameStarted: true });
    },

    selectStock: (symbol: string) => {
      set({ selectedStock: symbol });
    },

    buyStock: (symbol: string, shares: number) => {
      const state = get();
      const stockPrice = window.marketData?.getStockPrice(symbol) || 100;
      const totalCost = stockPrice * shares;

      if (state.player.cash >= totalCost) {
        set({
          player: {
            ...state.player,
            cash: state.player.cash - totalCost,
            portfolio: {
              ...state.player.portfolio,
              [symbol]: (state.player.portfolio[symbol] || 0) + shares
            }
          }
        });

        // Increase legal risk for large trades
        if (totalCost > 50000) {
          get().increaseLegalRisk(2);
        }
      }
    },

    sellStock: (symbol: string, shares: number) => {
      const state = get();
      const currentShares = state.player.portfolio[symbol] || 0;
      const stockPrice = window.marketData?.getStockPrice(symbol) || 100;

      if (currentShares >= shares) {
        const totalValue = stockPrice * shares;
        const newPortfolio = { ...state.player.portfolio };
        
        if (newPortfolio[symbol] === shares) {
          delete newPortfolio[symbol];
        } else {
          newPortfolio[symbol] = currentShares - shares;
        }

        set({
          player: {
            ...state.player,
            cash: state.player.cash + totalValue,
            portfolio: newPortfolio
          }
        });

        // Increase legal risk for large trades
        if (totalValue > 50000) {
          get().increaseLegalRisk(1);
        }
      }
    },

    createCompany: (name: string) => {
      const state = get();
      if (state.player.cash >= 50000) {
        set({
          player: {
            ...state.player,
            cash: state.player.cash - 50000
          },
          company: {
            name,
            value: 50000,
            employees: [],
            performance: 0
          }
        });
      }
    },

    hireEmployee: (role?: EmployeeRole) => {
      const state = get();
      if (state.company && state.player.cash >= 25000) {
        const names = ['Alex Johnson', 'Maria Garcia', 'James Wilson', 'Lisa Zhang', 'Robert Brown', 'Jennifer Chen', 'Michael Rodriguez', 'Sarah Kim', 'David Taylor', 'Amanda White'];
        
        const availableRoles = Object.keys(EMPLOYEE_ROLES) as EmployeeRole[];
        const selectedRole = role || availableRoles[Math.floor(Math.random() * availableRoles.length)];
        const roleData = EMPLOYEE_ROLES[selectedRole];
        
        const newEmployee: Employee = {
          id: Date.now().toString(),
          name: names[Math.floor(Math.random() * names.length)],
          role: selectedRole,
          specialization: roleData.specializations[Math.floor(Math.random() * roleData.specializations.length)],
          competence: 40 + Math.floor(Math.random() * 40),
          loyalty: 50 + Math.floor(Math.random() * 40),
          salary: roleData.baseSalary + Math.floor(Math.random() * 3000),
          experience: 0,
          skillLevel: 1,
          abilities: roleData.abilities
        };

        set({
          player: {
            ...state.player,
            cash: state.player.cash - 25000
          },
          company: {
            ...state.company,
            employees: [...state.company.employees, newEmployee],
            value: state.company.value + 20000
          }
        });
      }
    },

    upgradeEmployee: (id: string, type: 'competence' | 'salary') => {
      const state = get();
      if (!state.company) return;

      const cost = type === 'competence' ? 8000 : 3000;
      if (state.player.cash < cost) return;

      const updatedEmployees = state.company.employees.map(emp => {
        if (emp.id === id) {
          if (type === 'competence') {
            const newExp = emp.experience + 10;
            const newSkillLevel = Math.floor(newExp / 50) + 1;
            return { 
              ...emp, 
              competence: Math.min(100, emp.competence + 15),
              experience: newExp,
              skillLevel: Math.min(5, newSkillLevel)
            };
          } else {
            return { ...emp, salary: emp.salary + 1500, loyalty: Math.min(100, emp.loyalty + 8) };
          }
        }
        return emp;
      });

      set({
        player: {
          ...state.player,
          cash: state.player.cash - cost
        },
        company: {
          ...state.company,
          employees: updatedEmployees
        }
      });
    },

    trainEmployee: (id: string, skill: string) => {
      const state = get();
      if (!state.company || state.player.cash < 15000) return;

      const updatedEmployees = state.company.employees.map(emp => {
        if (emp.id === id) {
          return {
            ...emp,
            specialization: skill,
            competence: Math.min(100, emp.competence + 20),
            experience: emp.experience + 25,
            skillLevel: Math.min(5, Math.floor((emp.experience + 25) / 50) + 1)
          };
        }
        return emp;
      });

      set({
        player: {
          ...state.player,
          cash: state.player.cash - 15000
        },
        company: {
          ...state.company,
          employees: updatedEmployees
        }
      });
    },

    getEmployeeBonus: (role: EmployeeRole) => {
      const state = get();
      if (!state.company) return 0;
      
      const roleConfig = EMPLOYEE_ROLES[role];
      if (!roleConfig) return 0;
      
      const employees = state.company.employees.filter(emp => emp.role === role);
      return employees.reduce((total, emp) => {
        const roleMultiplier = roleConfig.bonusMultiplier;
        return total + (emp.competence * emp.skillLevel * roleMultiplier / 100);
      }, 0);
    },

    requestFavor: (contactId: string, type: 'money' | 'info' | 'sabotage') => {
      const state = get();
      const contact = state.contacts.find(c => c.id === contactId);
      if (!contact) return;

      const updatedContacts = state.contacts.map(c => {
        if (c.id === contactId) {
          if (type === 'money' && c.loyalty > 50) {
            // Grant loan
            const loanAmount = Math.floor(c.netWorth * 0.01);
            set({
              player: {
                ...state.player,
                cash: state.player.cash + loanAmount
              }
            });
            return { ...c, loyalty: Math.max(0, c.loyalty - 10) };
          } else if (type === 'info' && c.loyalty > 30) {
            // Provide insider tip (increase legal risk)
            get().increaseLegalRisk(5);
            return { ...c, loyalty: Math.max(0, c.loyalty - 5) };
          } else if (type === 'sabotage' && state.player.cash >= 10000) {
            // Sabotage rival
            set({
              player: {
                ...state.player,
                cash: state.player.cash - 10000
              }
            });
            get().increaseLegalRisk(10);
            return { ...c, loyalty: Math.max(0, c.loyalty - 15) };
          }
        }
        return c;
      });

      set({ contacts: updatedContacts });
    },

    helpContact: (contactId: string) => {
      const state = get();
      const updatedContacts = state.contacts.map(c => {
        if (c.id === contactId && c.currentProblem) {
          return {
            ...c,
            loyalty: Math.min(100, c.loyalty + Math.floor(c.influence / 10)),
            currentProblem: undefined
          };
        }
        return c;
      });

      set({ contacts: updatedContacts });
    },

    settleLawsuit: (id: string) => {
      const state = get();
      const lawsuit = state.lawsuits.find(l => l.id === id);
      if (!lawsuit || state.player.cash < lawsuit.settlementAmount) return;

      set({
        player: {
          ...state.player,
          cash: state.player.cash - lawsuit.settlementAmount
        },
        lawsuits: state.lawsuits.filter(l => l.id !== id),
        legalRisk: Math.max(0, state.legalRisk - 10)
      });
    },

    goToTrial: (id: string) => {
      const state = get();
      const lawsuit = state.lawsuits.find(l => l.id === id);
      if (!lawsuit) return;

      const won = Math.random() * 100 < lawsuit.winProbability;
      
      if (won) {
        // Won the trial
        set({
          lawsuits: state.lawsuits.filter(l => l.id !== id),
          legalRisk: Math.max(0, state.legalRisk - 15)
        });
      } else {
        // Lost the trial
        const penalty = lawsuit.maxPenalty;
        set({
          player: {
            ...state.player,
            cash: Math.max(0, state.player.cash - penalty)
          },
          lawsuits: state.lawsuits.filter(l => l.id !== id),
          legalRisk: Math.max(0, state.legalRisk - 5)
        });
      }
    },

    increaseLegalRisk: (amount: number) => {
      const state = get();
      const newRisk = Math.min(100, state.legalRisk + amount);
      
      set({ legalRisk: newRisk });

      // Generate lawsuits at high risk levels
      if (newRisk > 70 && Math.random() < 0.1) {
        const lawsuitTypes = [
          'Insider Trading',
          'Market Manipulation',
          'Securities Fraud',
          'Breach of Fiduciary Duty'
        ];

        const newLawsuit: Lawsuit = {
          id: Date.now().toString(),
          type: lawsuitTypes[Math.floor(Math.random() * lawsuitTypes.length)],
          plaintiff: 'SEC',
          description: 'Federal investigation into suspicious trading patterns.',
          settlementAmount: 50000 + Math.floor(Math.random() * 200000),
          maxPenalty: 100000 + Math.floor(Math.random() * 500000),
          winProbability: 30 + Math.floor(Math.random() * 40),
          status: 'pending'
        };

        set({
          lawsuits: [...state.lawsuits, newLawsuit]
        });
      }
    }
  }))
);
