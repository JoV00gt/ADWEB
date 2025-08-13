import { validateBudget, validateName, validateTransactions, validateUserId } from "@/app/lib/utils/validation-rules";

describe('validate transactions', () => {
  test('returns error if a transaction has an invalid amount', () => {
    const result = validateTransactions([
      { amount: '', type: 'income', date: new Date() },
    ]);
    expect(result).toBe('Zorg ervoor dat alle bedragen ingevuld zijn en groter zijn dan 0.');
  });

  test('returns error if a transaction has an amount of 0 or less', () => {
    const result = validateTransactions([
      { amount: '0', type: 'expense', date: new Date() },
    ]);
    expect(result).toBe('Zorg ervoor dat alle bedragen ingevuld zijn en groter zijn dan 0.');
  });

  test('returns no error and a empty string if all transactions are valid', () => {
    const result = validateTransactions([
      { amount: '100', type: 'income', date: new Date() },
    ]);
    expect(result).toBe('');
  });
});

describe('validate user', () => {
  test('throws an error if userId is false', () => {
    expect(() => validateUserId(null)).toThrow('Gebruiker is niet ingelogd');
    expect(() => validateUserId(undefined)).toThrow('Gebruiker is niet ingelogd');
    expect(() => validateUserId('')).toThrow('Gebruiker is niet ingelogd');
  });

  test('does not throw if userId is true', () => {
    expect(() => validateUserId('abc123')).not.toThrow();
    expect(() => validateUserId(123)).not.toThrow();
  });
});

describe('validate name', () => {
  test('throws an error if name is undefined, empty, or only spaces', () => {
    expect(() => validateName(undefined)).toThrow('Naam is verplicht');
    expect(() => validateName('')).toThrow('Naam is verplicht');
    expect(() => validateName('   ')).toThrow('Naam is verplicht');
  });

  test('does not throw if name is valid', () => {
    expect(() => validateName('Budget')).not.toThrow();
  });
});

describe('validate budget', () => {
  test('throws error if budget is not a number', () => {
    expect(() => validateBudget('abc')).toThrow('Er moet een positief getal zijn voor budget');
  });

  test('throws error if budget is negative', () => {
    expect(() => validateBudget(-100)).toThrow('Er moet een positief getal zijn voor budget');
  });

  test('does not throw if budget is zero or positive', () => {
    expect(() => validateBudget(0)).not.toThrow();
    expect(() => validateBudget(100)).not.toThrow();
    expect(() => validateBudget('50')).not.toThrow();
  });
});
