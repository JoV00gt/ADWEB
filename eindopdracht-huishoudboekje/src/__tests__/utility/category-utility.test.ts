import { Transaction } from '@/app/lib/definitions';
import { calculateCategoryUsage } from '@/app/lib/utils/category-utils';

const mockTransactions: Transaction[] = [
  { id: '1', categoryId: 'boodschappen', type: 'uitgave', amount: 50, date: new Date('2025-08-01') },
  { id: '2', categoryId: 'boodschappen', type: 'uitgave', amount: 30, date: new Date('2025-08-02') },
  { id: '3', categoryId: 'boodschappen', type: 'inkomen', amount: 20, date: new Date('2025-08-02') }, 
  { id: '4', categoryId: 'boodschappen', type: 'uitgave', amount: 40, date: new Date('2025-08-10') },
  { id: '5', categoryId: 'huur', type: 'uitgave', amount: 1000, date: new Date('2025-08-03') }, 
];


describe('calculate category usage', () => {
  test('calculates usage correctly without end date', () => {
    const result = calculateCategoryUsage('boodschappen', 200, mockTransactions, undefined);

    expect(result.available).toBe(80);
    expect(result.percentageUsed).toBe(60);
    expect(result.isOver).toBe(false);
    expect(result.isWarning).toBe(false);
  });

  test('calculates usage with warning when usage >= 90% of budget', () => {
    const result = calculateCategoryUsage('boodschappen', 133.33, mockTransactions, undefined);

    expect(result.percentageUsed).toBeCloseTo(90, 1);
    expect(result.isWarning).toBe(true);
    expect(result.isOver).toBe(false);
  });

  test('flags overspending when usage exceeds budget', () => {
    const result = calculateCategoryUsage('boodschappen', 100, mockTransactions, undefined);

    expect(result.available).toBeLessThan(0);
    expect(result.isOver).toBe(true);
    expect(result.isWarning).toBe(false);
  });

  test('filters out transactions after the end date', () => {
    const endDate = new Date('2025-08-02');
    const result = calculateCategoryUsage('boodschappen', 200, mockTransactions, endDate);

    expect(result.available).toBe(120);
    expect(result.percentageUsed).toBe(40);
  });

  test('handles zero budget', () => {
    const result = calculateCategoryUsage('boodschappen', 0, mockTransactions, undefined);

    expect(result.available).toBeLessThan(0);
    expect(result.percentageUsed).toBe(0);
    expect(result.isOver).toBe(true);
    expect(result.isWarning).toBe(false);
  });

  test('returns 100% used if usage > budget and budget is very small', () => {
    const result = calculateCategoryUsage('boodschappen', 0.01, mockTransactions, undefined);
    expect(result.percentageUsed).toBe(100);
  });
});
