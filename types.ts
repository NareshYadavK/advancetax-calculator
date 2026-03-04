
export enum TaxRegime {
  OLD = 'OLD',
  NEW = 'NEW'
}

export interface IncomeData {
  salary: number;
  houseProperty: number; // Net income from house property
  businessProfession: number;
  capitalGainsSTCG: number;
  capitalGainsLTCG: number;
  otherSources: number;
  tdsTcs: number;
}

export interface DeductionsData {
  section80C: number;
  section80D: number;
  section80CCD1B: number; // Additional NPS
  section80E: number; // Education loan interest
  section80G: number; // Donations
  section80TTA: number; // Savings interest
  hra: number;
  otherDeductions: number;
}

export interface TaxBreakdown {
  regime: TaxRegime;
  grossTotalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  basicTax: number;
  surcharge: number;
  cess: number;
  totalTaxLiability: number;
  netPayableAfterTDS: number;
  quarterlyPayments: {
    june: number;
    september: number;
    december: number;
    march: number;
  };
}

export interface ComparisonResult {
  oldRegime: TaxBreakdown;
  newRegime: TaxBreakdown;
  bestRegime: TaxRegime;
  savings: number;
}
