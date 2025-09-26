export type EmployeeRole = 'analyst' | 'trader' | 'lawyer' | 'compliance' | 'risk_manager';

export interface RoleConfig {
  name: string;
  icon: string;
  color: string;
  description: string;
  specializations: string[];
  abilities: string[];
  baseSalary: number;
  bonusMultiplier: number;
}

export const EMPLOYEE_ROLES: Record<EmployeeRole, RoleConfig> = {
  analyst: {
    name: 'Market Analyst',
    icon: 'brain',
    color: 'text-blue-400',
    description: 'Provides market insights and stock analysis',
    specializations: ['Market Research', 'Technical Analysis', 'Fundamental Analysis', 'Sector Analysis'],
    abilities: ['Stock Insights', 'Market Predictions', 'Research Reports'],
    baseSalary: 7000,
    bonusMultiplier: 0.05 // 5% market insight bonus
  },
  trader: {
    name: 'Trader',
    icon: 'trending-up',
    color: 'text-green-400',
    description: 'Executes trades for maximum profit',
    specializations: ['Day Trading', 'Options Trading', 'Forex Trading', 'Algorithmic Trading'],
    abilities: ['Fast Execution', 'Market Making', 'Profit Optimization'],
    baseSalary: 9000,
    bonusMultiplier: 0.08 // 8% trading profit bonus
  },
  lawyer: {
    name: 'Corporate Lawyer',
    icon: 'scale',
    color: 'text-purple-400',
    description: 'Handles legal matters and reduces risk',
    specializations: ['Securities Law', 'Corporate Law', 'Regulatory Compliance', 'Litigation'],
    abilities: ['Legal Protection', 'Risk Mitigation', 'Settlement Negotiation'],
    baseSalary: 12000,
    bonusMultiplier: 0.03 // 3% legal protection bonus
  },
  compliance: {
    name: 'Compliance Officer',
    icon: 'shield',
    color: 'text-yellow-400',
    description: 'Ensures regulatory compliance',
    specializations: ['Regulatory Compliance', 'Risk Assessment', 'Audit Management', 'Policy Development'],
    abilities: ['Risk Reduction', 'Audit Protection', 'Regulatory Shield'],
    baseSalary: 8000,
    bonusMultiplier: 0.04 // 4% risk reduction bonus
  },
  risk_manager: {
    name: 'Risk Manager',
    icon: 'alert-triangle',
    color: 'text-red-400',
    description: 'Manages and mitigates business risks',
    specializations: ['Portfolio Risk', 'Market Risk', 'Operational Risk', 'Credit Risk'],
    abilities: ['Risk Assessment', 'Portfolio Protection', 'Loss Prevention'],
    baseSalary: 10000,
    bonusMultiplier: 0.06 // 6% risk management bonus
  }
};