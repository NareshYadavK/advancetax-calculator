
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TaxInputs, CalculationResult } from '../types';

export const generateTaxPDF = (inputs: TaxInputs, results: CalculationResult) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text('Advance TaxPro Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(`Financial Year: 2025-26 | Assessment Year: 2026-27`, 14, 30);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 35);

  // Profile Section
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('User Profile', 14, 48);
  
  const ageLabel = inputs.age === 'below60' ? 'Below 60 (General)' : inputs.age === '60to80' ? '60-80 (Senior)' : 'Above 80 (Super Senior)';
  
  autoTable(doc, {
    startY: 52,
    head: [['Category', 'Details']],
    body: [
      ['Age Category', ageLabel],
      ['Total Gross Income', formatCurrency(results.newRegime.grossIncome)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
  });

  // Income & Capital Gains
  doc.text('Income Sources', 14, (doc as any).lastAutoTable.finalY + 15);
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 19,
    head: [['Source', 'Amount']],
    body: [
      ['Annual Salary', formatCurrency(inputs.salary)],
      ['Interest & Other Income', formatCurrency(inputs.interestIncome + inputs.otherIncome)],
      ['Equity Capital Gains', formatCurrency(inputs.equitySTCG + inputs.equityLTCG)],
      ['Property Capital Gains', formatCurrency(inputs.propertySTCG + inputs.propertyLTCG)],
      ['Debt & Others', formatCurrency(inputs.debtSTCG + inputs.debtLTCG)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85] },
  });

  // Comparison Summary
  doc.text('Comparison Summary', 14, (doc as any).lastAutoTable.finalY + 15);
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 19,
    head: [['Parameter', 'Old Tax Regime', 'New Tax Regime']],
    body: [
      ['Taxable Slab Income', formatCurrency(results.oldRegime.taxableIncome), formatCurrency(results.newRegime.taxableIncome)],
      ['Tax on Slab', formatCurrency(results.oldRegime.baseTax), formatCurrency(results.newRegime.baseTax)],
      ['Capital Gains Tax', formatCurrency(results.oldRegime.capitalGainsTax), formatCurrency(results.newRegime.capitalGainsTax)],
      ['Rebate (87A)', formatCurrency(results.oldRegime.rebate87A), formatCurrency(results.newRegime.rebate87A)],
      ['Surcharge & Cess', formatCurrency(results.oldRegime.surcharge + results.oldRegime.cess), formatCurrency(results.newRegime.surcharge + results.newRegime.cess)],
      ['Total Tax Liability', formatCurrency(results.oldRegime.totalTax), formatCurrency(results.newRegime.totalTax)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
      2: { halign: 'right' },
    }
  });

  // Final Verdict
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  const betterRegime = results.newRegime.totalTax <= results.oldRegime.totalTax ? 'New Tax Regime' : 'Old Tax Regime';
  const liability = Math.min(results.newRegime.totalTax, results.oldRegime.totalTax);

  doc.setFillColor(248, 250, 252); // Slate-50
  doc.roundedRect(14, finalY, pageWidth - 28, 40, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Recommendation: Choose the ${betterRegime}`, 20, finalY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Advance Tax Installments (based on optimal choice):`, 20, finalY + 18);
  doc.text(`- By Jun 15 (15%): ${formatCurrency(liability * 0.15)}`, 25, finalY + 25);
  doc.text(`- By Sep 15 (45%): ${formatCurrency(liability * 0.45)}`, 25, finalY + 30);
  doc.text(`- By Dec 15 (75%): ${formatCurrency(liability * 0.75)}`, 25, finalY + 35);

  // Save PDF
  doc.save(`Advance_Tax_Report_2025-26_${new Date().getTime()}.pdf`);
};
