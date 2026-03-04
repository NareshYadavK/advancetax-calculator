
import { TaxRegime, IncomeData, DeductionsData, TaxBreakdown } from '../types';

export const calculateTax = (
  income: IncomeData,
  deductions: DeductionsData,
  regime: TaxRegime
): TaxBreakdown => {
  const grossTotalIncome = 
    income.salary + 
    income.houseProperty + 
    income.businessProfession + 
    income.capitalGainsSTCG + 
    income.capitalGainsLTCG + 
    income.otherSources;

  let totalDeductions = 0;
  let standardDeduction = 0;

  if (regime === TaxRegime.OLD) {
    standardDeduction = income.salary > 0 ? 50000 : 0;
    // Cap 80C at 1.5L
    const capped80C = Math.min(deductions.section80C, 150000);
    totalDeductions = 
      standardDeduction + 
      capped80C + 
      deductions.section80D + 
      deductions.section80CCD1B + 
      deductions.section80E + 
      deductions.section80G + 
      deductions.section80TTA + 
      deductions.hra + 
      deductions.otherDeductions;
  } else {
    // New Tax Regime FY 2025-26 updates
    // Assume Budget 2024/25 structure remains: Standard deduction 75k for salaried
    standardDeduction = income.salary > 0 ? 75000 : 0;
    totalDeductions = standardDeduction; // Most deductions not allowed in New Regime
  }

  const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions);
  let basicTax = 0;

  if (regime === TaxRegime.NEW) {
    // New Regime Slabs (FY 2025-26 - Estimate based on Budget 2024 updates)
    // 0 - 3L: Nil
    // 3 - 7L: 5%
    // 7 - 10L: 10%
    // 10 - 12L: 15%
    // 12 - 15L: 20%
    // > 15L: 30%
    if (taxableIncome <= 300000) basicTax = 0;
    else if (taxableIncome <= 700000) basicTax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 1000000) basicTax = 20000 + (taxableIncome - 700000) * 0.10;
    else if (taxableIncome <= 1200000) basicTax = 50000 + (taxableIncome - 1000000) * 0.15;
    else if (taxableIncome <= 1500000) basicTax = 80000 + (taxableIncome - 1200000) * 0.20;
    else basicTax = 140000 + (taxableIncome - 1500000) * 0.30;

    // Rebate u/s 87A for New Regime: Up to 7L income (Tax nil)
    // Note: Technically for FY 24-25 it's 7L, we assume same for 25-26
    if (taxableIncome <= 700000) basicTax = 0;
  } else {
    // Old Regime Slabs
    // 0 - 2.5L: Nil
    // 2.5 - 5L: 5%
    // 5 - 10L: 20%
    // > 10L: 30%
    if (taxableIncome <= 250000) basicTax = 0;
    else if (taxableIncome <= 500000) basicTax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) basicTax = 12500 + (taxableIncome - 500000) * 0.20;
    else basicTax = 112500 + (taxableIncome - 1000000) * 0.30;

    // Rebate u/s 87A for Old Regime: Up to 5L income
    if (taxableIncome <= 500000) basicTax = 0;
  }

  // Surcharge (simplified for general individuals)
  let surcharge = 0;
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) surcharge = basicTax * 0.10;
  else if (taxableIncome > 10000000 && taxableIncome <= 20000000) surcharge = basicTax * 0.15;
  else if (taxableIncome > 20000000) {
    // For new regime surcharge is capped at 25% (max rate reduction in Budget 2023 onwards)
    const surchargeRate = regime === TaxRegime.NEW ? 0.25 : 0.37;
    surcharge = basicTax * surchargeRate;
  }

  const cess = (basicTax + surcharge) * 0.04;
  const totalTaxLiability = basicTax + surcharge + cess;
  const netPayableAfterTDS = Math.max(0, totalTaxLiability - income.tdsTcs);

  // Advance Tax Installments
  // June 15: 15%
  // Sep 15: 45% (Cumulative)
  // Dec 15: 75% (Cumulative)
  // Mar 15: 100% (Cumulative)
  // Note: Only payable if tax liability after TDS >= 10,000
  const isAdvanceTaxApplicable = netPayableAfterTDS >= 10000;

  return {
    regime,
    grossTotalIncome,
    totalDeductions,
    taxableIncome,
    basicTax,
    surcharge,
    cess,
    totalTaxLiability,
    netPayableAfterTDS,
    quarterlyPayments: {
      june: isAdvanceTaxApplicable ? Math.round(netPayableAfterTDS * 0.15) : 0,
      september: isAdvanceTaxApplicable ? Math.round(netPayableAfterTDS * 0.45) : 0,
      december: isAdvanceTaxApplicable ? Math.round(netPayableAfterTDS * 0.75) : 0,
      march: isAdvanceTaxApplicable ? Math.round(netPayableAfterTDS * 1.00) : 0,
    },
  };
};
