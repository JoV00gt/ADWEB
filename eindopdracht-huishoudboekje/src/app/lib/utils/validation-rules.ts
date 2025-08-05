export function validateTransactions(transactions: { amount: string; type: string; date: Date }[]) {
  for (const tx of transactions) {
    const amountNum = Number(tx.amount);
    if (!tx.amount || isNaN(amountNum) || amountNum <= 0) {
      return 'Zorg ervoor dat alle bedragen ingevuld zijn en groter zijn dan 0.';
    }
  }
  return '';
}

export function validateUserId(userId: any) {
  if (!userId) {
    throw new Error('Gebruiker is niet ingelogd');
  }
}

export function validateName(name: string | undefined) {
  if (!name || name.trim() === '') {
    throw new Error('Naam is verplicht');
  }
}

export function validateBudget(budget: string | number) {
  const budgetValue = Number(budget);
  if (isNaN(budgetValue) || budgetValue < 0) {
    throw new Error('Limiet moet een positief getal zijn');
  }
}