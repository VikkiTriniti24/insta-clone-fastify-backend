"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryOne = exports.queryAll = exports.seedTable = exports.runStatements = exports.runInTransaction = void 0;
const runInTransaction = (db, work, ...args) => {
    const transaction = db.transaction(work);
    return transaction(...args);
};
exports.runInTransaction = runInTransaction;
const runStatements = (db, statements) => {
    if (statements.length === 0) {
        return;
    }
    (0, exports.runInTransaction)(db, () => {
        statements.forEach((statement) => {
            db.prepare(statement).run();
        });
    });
};
exports.runStatements = runStatements;
const seedTable = (db, insertStatement, rows) => {
    if (rows.length === 0) {
        return;
    }
    const preparedInsert = db.prepare(insertStatement);
    (0, exports.runInTransaction)(db, () => {
        rows.forEach((row) => {
            preparedInsert.run(row);
        });
    });
};
exports.seedTable = seedTable;
const queryAll = (db, query, params = {}) => {
    const statement = db.prepare(query);
    return statement.all(params);
};
exports.queryAll = queryAll;
const queryOne = (db, query, params = {}) => {
    const statement = db.prepare(query);
    return statement.get(params);
};
exports.queryOne = queryOne;
