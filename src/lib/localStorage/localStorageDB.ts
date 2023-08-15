import {LocalStorage} from "./localStorage";
import {logger, LogType} from "../utils/loggerUtils";


export interface LocalDB {
    schema: Map<string, object>
}

export enum QueryOperators {
    "eq",
    "neq",
    "gt",
    "lt",
    "gte",
    "lte"
}

export enum QuerySort {
    "asc",
    "desc"
}

export interface QueryFilter {
    operator: QueryOperators
    field: string
    value: any
}

export interface SortFiler {
    sort: QuerySort
    field: string
}

export class LocalStorageDB {

    private static _instance: LocalStorageDB = null;
    private _database: string = null;
    private _schema: Map<string, object> = new Map<string, object>();

    static getInstance(): LocalStorageDB {

        if (LocalStorageDB._instance == null) {
            LocalStorageDB._instance = new LocalStorageDB();
        }

        return LocalStorageDB._instance;
    }

    private constructor() {

    }

    connect(database: string): void {
        LocalStorage.init();

        if (!LocalStorage.doesKeyExist(database)) {
            LocalStorage.saveObject(`${database}.schemas`, {});
        }

        this._database = database;
    }

    createTable(tableName: string, columns: Array<string>): boolean {

        if (this._database == null) {
            logger(LogType.ERROR, "Database not created");
            return false;
        }

        if (this._schema.has(tableName)) {
            logger(LogType.ERROR, `Table ${tableName} already exists`);
            return false;
        }


        LocalStorage.saveObject(`${this._database}.schemas.${tableName}`, columns);
        LocalStorage.saveObject(`${this._database}.data.${tableName}`, []);
    }

    insert(tableName: string, row: object): boolean {


        logger(LogType.INFO, `INSERT TableName: ${tableName} row: ${JSON.stringify(row)}`);

        if (!LocalStorage.doesKeyExist(`${this._database}.schemas.${tableName}`)) {
            logger(LogType.ERROR, `Table ${tableName} does not exist.`);
            return false;
        }

        let toInsertColumns: Set<string> = new Set();

        for (const property in row) {
            toInsertColumns.add(property);
        }

        // @ts-ignore
        let schemaDefinition: Array<string> = LocalStorage.getObject(`${this._database}.schemas.${tableName}`);

        if (toInsertColumns.size != schemaDefinition.length) {
            logger(LogType.ERROR, `Table ${tableName} schema does not match row.`);
            return false;
        }

        schemaDefinition.forEach((col: string) => {
            toInsertColumns.delete(col);
        });

        if (toInsertColumns.size > 0) {
            logger(LogType.ERROR, `Table ${tableName} schema does not match row.`);
            return false;
        }

        // @ts-ignore
        let data: Array<Object> = LocalStorage.getObject(`${this._database}.data.${tableName}`);
        data.push(row);
        LocalStorage.saveObject(`${this._database}.data.${tableName}`, data);

        return true;
    }

    query(tableName: string, where: Array<QueryFilter> = null, sort: SortFiler = null, limit: number = 250): Array<object> {

        if (!LocalStorage.doesKeyExist(`${this._database}.schemas.${tableName}`)) {
            logger(LogType.ERROR, `Table ${tableName} does not exist.`);
            return [];
        }

        if (!where) {

            if (!sort) {
                return LocalStorage.getObject(`${this._database}.data.${tableName}`) as Array<Object>;
            } else {
                let rows = LocalStorage.getObject(`${this._database}.data.${tableName}`) as Array<Object>;
                ;

                if (sort.sort == QuerySort.asc) {
                    return rows.sort((a, b) => {
                        //@ts-ignore
                        return a[sort.field] - b[sort.field];
                    });
                } else {
                    return rows.sort((a, b) => {
                        //@ts-ignore
                        return b[sort.field] - a[sort.field];
                    });
                }
            }
        }

        let rows = LocalStorage.getObject(`${this._database}.data.${tableName}`) as Array<Object>;

        where.forEach((clause: QueryFilter) => {

            if (clause.operator == QueryOperators.eq) {
                // @ts-ignore
                rows = rows.filter((row: Object) => row[clause.field] === clause.value);
            } else if (clause.operator == QueryOperators.neq) {
                // @ts-ignore
                rows = rows.filter((row: Object) => row[clause.field] !== clause.value);
            } else if (clause.operator == QueryOperators.gt) {
                // @ts-ignore
                rows = rows.filter((row: Object) => row[clause.field] > clause.value);
            } else if (clause.operator == QueryOperators.lt) {
                // @ts-ignore
                rows = rows.filter((row: Object) => row[clause.field] < clause.value);
            } else if (clause.operator == QueryOperators.gte) {
                // @ts-ignore
                rows = rows.filter((row: Object) => row[clause.field] >= clause.value);
            } else if (clause.operator == QueryOperators.lte) {
                // @ts-ignore
                rows = rows.filter((row: Object) => row[clause.field] <= clause.value);
            }
        });

        if (!sort) {
            return rows;
        }

        if (sort.sort == QuerySort.asc) {
            return rows.sort((a, b) => {
                //@ts-ignore
                return a[sort.field] - b[sort.field]
            });
        } else {
            return rows.sort((a, b) => {
                //@ts-ignore
                return b[sort.field] - a[sort.field]
            });
        }
    }

    delete(tableName: string, where: Array<QueryFilter>): void {

        where.forEach((clause) => {

            if (clause.operator == QueryOperators.eq) {
                // @ts-ignore
                clause.operator = QueryOperators.neq;
            } else if (clause.operator == QueryOperators.neq) {
                // @ts-ignore
                clause.operator = QueryOperators.eq;
            } else if (clause.operator == QueryOperators.gt) {
                // @ts-ignore
                clause.operator = QueryOperators.lt;
            } else if (clause.operator == QueryOperators.lt) {
                // @ts-ignore
                clause.operator = QueryOperators.gt;
            } else if (clause.operator == QueryOperators.gte) {
                // @ts-ignore
                clause.operator = QueryOperators.lte;
            } else if (clause.operator == QueryOperators.lte) {
                // @ts-ignore
                clause.operator = QueryOperators.gte;
            }
        });

        let rows = this.query(tableName, where);
        LocalStorage.saveObject(`${this._database}.data.${tableName}`, rows);
    }

    rowCount(tableName: string): number {
        if (!LocalStorage.doesKeyExist(`${this._database}.schemas.${tableName}`)) {
            logger(LogType.ERROR, `Table ${tableName} does not exist.`);
            return -1;
        }

        let array = LocalStorage.getObject(`${this._database}.data.${tableName}`) as Array<Object>;
        return array.length;
    }

    drop(tableName: string) {
        LocalStorage.deleteObject(`${this._database}.schemas.${tableName}`);
        LocalStorage.deleteObject(`${this._database}.data.${tableName}`);
    }

    truncate(tableName: string) {
        LocalStorage.saveObject(`${this._database}.data.${tableName}`, []);
    }

    doesTableExist(tableName: string): boolean {
        return LocalStorage.doesKeyExist(`${this._database}.schemas.${tableName}`);
    }
}
