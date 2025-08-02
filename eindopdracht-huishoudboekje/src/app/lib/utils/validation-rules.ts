export function validateTransactions(transactions: { amount: string; type: string; date: Date }[]) {
  for (const tx of transactions) {
    const amountNum = Number(tx.amount);
    if (!tx.amount || isNaN(amountNum) || amountNum <= 0) {
      return 'Zorg ervoor dat alle bedragen ingevuld zijn en groter zijn dan 0.';
    }
  }
  return '';
}