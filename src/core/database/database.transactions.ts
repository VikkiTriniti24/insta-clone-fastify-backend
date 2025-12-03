import type { Database } from 'better-sqlite3';

export type TransactionWork<TArgs extends unknown[], TResult> = (...args: TArgs) => TResult;
export type StatementParameters = Record<string, unknown>;

export const runInTransaction = <TArgs extends unknown[], TResult>(
  db: Database,
  work: TransactionWork<TArgs, TResult>,
  ...args: TArgs
): TResult => {
  const transaction = db.transaction(work);
  return transaction(...args);
};

export const runStatements = (db: Database, statements: string[]): void => {
  if (statements.length === 0) {
    return;
  }

  runInTransaction(db, () => {
    statements.forEach((statement) => {
      db.prepare(statement).run();
    });
  });
};

export const seedTable = <TRow extends StatementParameters>(
  db: Database,
  insertStatement: string,
  rows: readonly TRow[]
): void => {
  if (rows.length === 0) {
    return;
  }

  const preparedInsert = db.prepare(insertStatement);

  runInTransaction(db, () => {
    rows.forEach((row) => {
      preparedInsert.run(row);
    });
  });
};

export const queryAll = <TRow>(
  db: Database,
  query: string,
  params: StatementParameters = {}
): TRow[] => {
  const statement = db.prepare(query);
  return statement.all(params) as TRow[];
};

export const queryOne = <TRow>(
  db: Database,
  query: string,
  params: StatementParameters = {}
): TRow | undefined => {
  const statement = db.prepare(query);
  return statement.get(params) as TRow | undefined;
};
