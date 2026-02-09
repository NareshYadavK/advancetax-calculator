
import { TaxInputs, TaxBreakdown } from '../types';

export const calculateTax = (inputs: TaxInputs): { newRegime: TaxBreakdown; oldRegime: TaxBreakdown } => {
  const grossIncome = inputs.salary + inputs.bonus + inputs.interestIncome + inputs.rentalIncome + inputs.otherIncome;
  
  // Income taxed at slab rates (includes Debt STCG, Property STCG)
  const slabRateIncome = grossIncome + inputs.debtSTCG + inputs.propertySTCG;

  return {
    newRegime: calculateNewRegime(slabRateIncome, inputs),
    oldRegime: calculateOldRegime(slabRateIncome, inputs),
  };
};

const calculateCapitalGainsTax = (inputs: TaxInputs) => {
  // FY 2025-26 Special Rates (Post Budget 2024 Changes)
  // Equity STCG: 20%
  const equitySTCGTax = inputs.equitySTCG * 0.20;
  
  // Equity LTCG: 12.5% (Exemption: 1.25 Lakh)
  const equityLTCGExemption = 125000;
  const taxableEquityLTCG = Math.max(0, inputs.equityLTCG - equityLTCGExemption);
  const equityLTCGTax = taxableEquityLTCG * 0.125;
  
  // Property LTCG: 12.5% (No indexation)
  const propertyLTCGTax = inputs.propertyLTCG * 0.125;
  
  // Debt LTCG (if applicable, e.g. for non-specified debt funds or old ones) - usually now slab
  // However, for simplicity and sticking to the main 2025-26 rules:
  // Most debt funds are now taxed at slab rate regardless of holding period if bought after 1st April 2023.
  // We'll treat debtSTCG as slab income and debtLTCG as slab income for calculation.
  
  return equitySTCGTax + equityLTCGTax + propertyLTCGTax;
};

const calculateBaseTaxFromSlabs = (income: number, thresholds: { limit: number; rate: number; label: string }[]) => {
  let tax = 0;
  let remaining = income;
  for (const slab of thresholds) {
    if (remaining <= 0) break;
    const amountInSlab = Math.min(remaining, slab.limit);
    tax += amountInSlab * slab.rate;
    remaining -= amountInSlab;
  }
  return tax;
};

const calculateNewRegime = (slabIncome: number, inputs: TaxInputs): TaxBreakdown => {
  const standardDeduction = 75000;
  const taxableSlabIncome = Math.max(0, slabIncome - standardDeduction);

  const thresholds = [
    { limit: 400000, rate: 0, label: "0-4L" },
    { limit: 400000, rate: 0.05, label: "4-8L" },
    { limit: 400000, rate: 0.10, label: "8-12L" },
    { limit: 300000, rate: 0.15, label: "12-15L" },
    { limit: 500000, rate: 0.20, label: "15-20L" },
    { limit: Infinity, rate: 0.30, label: "Above 20L" },
  ];

  const baseTax = calculateBaseTaxFromSlabs(taxableSlabIncome, thresholds);
  const capitalGainsTax = calculateCapitalGainsTax(inputs);
  const totalBaseTax = baseTax + capitalGainsTax;
  
  const slabsDisplay = [];
  let tempRemaining = taxableSlabIncome;
  for (const slab of thresholds) {
    if (tempRemaining <= 0) break;
    const amount = Math.min(tempRemaining, slab.limit);
    if (amount > 0) slabsDisplay.push({ range: slab.label, rate: `${slab.rate * 100}%`, amount: amount * slab.rate });
    tempRemaining -= amount;
  }

  let rebate = 0;
  let taxAfterRebate = totalBaseTax;

  if (taxableSlabIncome <= 1200000) {
    // Note: Rebate 87A for New Regime is usually only on slab income tax
    rebate = baseTax; 
    taxAfterRebate = capitalGainsTax; 
  } else {
    const incomeOverLimit = taxableSlabIncome - 1200000;
    if (baseTax > incomeOverLimit) {
      const relief = baseTax - incomeOverLimit;
      rebate = relief;
      taxAfterRebate = totalBaseTax - relief;
    }
  }

  const surcharge = calculateSurchargeWithRelief(taxableSlabIncome, taxAfterRebate, 'new', thresholds);
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = taxAfterRebate + surcharge + cess;

  return {
    grossIncome: slabIncome + inputs.equitySTCG + inputs.equityLTCG + inputs.propertyLTCG,
    taxableIncome: taxableSlabIncome,
    baseTax,
    capitalGainsTax,
    rebate87A: rebate,
    surcharge,
    cess,
    totalTax,
    effectiveRate: (slabIncome + inputs.equitySTCG + inputs.equityLTCG + inputs.propertyLTCG) > 0 ? (totalTax / (slabIncome + inputs.equitySTCG + inputs.equityLTCG + inputs.propertyLTCG)) * 100 : 0,
    slabs: slabsDisplay
  };
};

const calculateOldRegime = (slabIncome: number, inputs: TaxInputs): TaxBreakdown => {
  const standardDeduction = 50000;
  const interestLimit = inputs.age === 'below60' ? 10000 : 50000;
  const interestDed = Math.min(interestLimit, inputs.deduction80TTA);

  const totalDeductions = 
    standardDeduction + 
    Math.min(150000, inputs.deduction80C) + 
    Math.min(75000, inputs.deduction80D) + 
    inputs.deductionHRA + 
    interestDed + 
    Math.min(200000, inputs.homeLoanInterest) +
    inputs.otherDeductions;

  const taxableSlabIncome = Math.max(0, slabIncome - totalDeductions);

  let thresholds: { limit: number; rate: number; label: string }[] = [];
  if (inputs.age === 'above80') {
    thresholds = [
      { limit: 500000, rate: 0, label: "0-5L" },
      { limit: 500000, rate: 0.20, label: "5-10L" },
      { limit: Infinity, rate: 0.30, label: "Above 10L" },
    ];
  } else if (inputs.age === '60to80') {
    thresholds = [
      { limit: 300000, rate: 0, label: "0-3L" },
      { limit: 200000, rate: 0.05, label: "3-5L" },
      { limit: 500000, rate: 0.20, label: "5-10L" },
      { limit: Infinity, rate: 0.30, label: "Above 10L" },
    ];
  } else {
    thresholds = [
      { limit: 250000, rate: 0, label: "0-2.5L" },
      { limit: 250000, rate: 0.05, label: "2.5-5L" },
      { limit: 500000, rate: 0.20, label: "5-10L" },
      { limit: Infinity, rate: 0.30, label: "Above 10L" },
    ];
  }

  const baseTax = calculateBaseTaxFromSlabs(taxableSlabIncome, thresholds);
  const capitalGainsTax = calculateCapitalGainsTax(inputs);
  const totalBaseTax = baseTax + capitalGainsTax;

  const slabsDisplay = [];
  let tempRemaining = taxableSlabIncome;
  for (const slab of thresholds) {
    if (tempRemaining <= 0) break;
    const amount = Math.min(tempRemaining, slab.limit);
    if (amount > 0) slabsDisplay.push({ range: slab.label, rate: `${slab.rate * 100}%`, amount: amount * slab.rate });
    tempRemaining -= amount;
  }

  let rebate = 0;
  if (taxableSlabIncome <= 500000) {
    rebate = Math.min(baseTax, 12500);
  }

  const taxAfterRebate = Math.max(0, totalBaseTax - rebate);
  const surcharge = calculateSurchargeWithRelief(taxableSlabIncome, taxAfterRebate, 'old', thresholds);
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = taxAfterRebate + surcharge + cess;

  return {
    grossIncome: slabIncome + inputs.equitySTCG + inputs.equityLTCG + inputs.propertyLTCG,
    taxableIncome: taxableSlabIncome,
    baseTax,
    capitalGainsTax,
    rebate87A: rebate,
    surcharge,
    cess,
    totalTax,
    effectiveRate: (slabIncome + inputs.equitySTCG + inputs.equityLTCG + inputs.propertyLTCG) > 0 ? (totalTax / (slabIncome + inputs.equitySTCG + inputs.equityLTCG + inputs.propertyLTCG)) * 100 : 0,
    slabs: slabsDisplay
  };
};

const calculateSurchargeWithRelief = (
  income: number, 
  tax: number, 
  regime: 'old' | 'new',
  thresholds: { limit: number; rate: number; label: string }[]
): number => {
  if (income <= 5000000) return 0;

  let rate = 0;
  let limit = 0;

  if (regime === 'new') {
    if (income <= 10000000) { rate = 0.10; limit = 5000000; }
    else { rate = 0.15; limit = 10000000; }
  } else {
    if (income <= 10000000) { rate = 0.10; limit = 5000000; }
    else if (income <= 20000000) { rate = 0.15; limit = 10000000; }
    else if (income <= 50000000) { rate = 0.25; limit = 20000000; }
    else { rate = 0.37; limit = 50000000; }
  }

  const normalSurcharge = tax * rate;
  const taxAtLimit = calculateBaseTaxFromSlabs(limit, thresholds);
  let prevRate = 0;
  if (limit === 10000000) prevRate = 0.10;
  else if (limit === 20000000) prevRate = 0.15;
  else if (limit === 50000000) prevRate = 0.25;

  const surchargeAtLimit = taxAtLimit * prevRate;
  const maxTotalWithSurcharge = (taxAtLimit + surchargeAtLimit) + (income - limit);
  const currentTotalWithSurcharge = tax + normalSurcharge;
  
  if (currentTotalWithSurcharge > maxTotalWithSurcharge) {
    return Math.max(0, maxTotalWithSurcharge - tax);
  }

  return normalSurcharge;
};
