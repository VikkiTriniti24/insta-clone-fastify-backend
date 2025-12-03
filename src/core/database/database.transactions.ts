import type { Database } from 'better-sqlite3';

export type TransactionWork<TArgs extends unknown[], TResult> = (...args: TArgs) => TResult;

export const runInTransaction = <TArgs extends unknown[], TResult>(
  db: Database,
  work: TransactionWork<TArgs, TResult>,
  ...args: TArgs
): TResult => {
  const transaction = db.transaction(work);
  return transaction(...args);
};
