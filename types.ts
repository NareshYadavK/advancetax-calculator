
export interface TaxInputs {
  salary: number;
  houseRent: number;
  bonus: number;
  interestIncome: number;
  rentalIncome: number;
  otherIncome: number;
  standardDeduction: number;
  deduction80C: number;
  deduction80D: number;
  deductionHRA: number;
  deduction80TTA: number;
  homeLoanInterest: number;
  otherDeductions: number;
  age: 'below60' | '60to80' | 'above80';
  // Capital Gains
  equitySTCG: number;
  equityLTCG: number;
  debtSTCG: number;
  debtLTCG: number;
  propertySTCG: number;
  propertyLTCG: number;
}

export interface TaxBreakdown {
  grossIncome: number;
  taxableIncome: number;
  baseTax: number;
  capitalGainsTax: number;
  rebate87A: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  slabs: { range: string; rate: string; amount: number }[];
}

export interface CalculationResult {
  newRegime: TaxBreakdown;
  oldRegime: TaxBreakdown;
}
