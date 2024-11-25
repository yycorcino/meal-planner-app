import { SQLiteDatabase, SQLiteBindParams } from "expo-sqlite";
import { relationships } from "./databaseRelationships";

// allows for custom select all searches
type getArgumentType = {
  columnName?: string | string[];
  action?: "LIKE" | "=";
  value?: any | any[];
};

/**
 * Make fetch queries.
 * @param {SQLiteDatabase} - Database connection.
 * @param {string} query - The SQL statement to run on db.
 * @params {any[]} [params] - Additional params to include with query.
 * @returns {Promise<any[]>} -  A promise that resolves to a list of the query results.
 * If the fetch query fails, an empty array will be returned.
 */
export async function fetchByQuery(
  db: SQLiteDatabase,
  query: string,
  params: SQLiteBindParams
): Promise<any[]> {
  try {
    const result = await db.getAllAsync(query, params);
    return result;
  } catch (error) {
    console.error("Database fetch query failed:", error);
    return [];
  }
}

/**
 * Make write queries: insert, update, delete.
 * @param {SQLiteDatabase} - Database connection.
 * @param {string} query - The SQL statement to run on db.
 * @params {any[]} [params] - Additional params to include with query.
 * @returns {Promise<number>} -  A promise that resolves to a number of last inserted row id.
 * If the write query fails, -1 is returned
 */
export async function writeByQuery(
  db: SQLiteDatabase,
  query: string,
  params: SQLiteBindParams
): Promise<number> {
  try {
    const result = await db.runAsync(query, params);
    return result.lastInsertRowId ?? -1;
  } catch (error) {
    console.error("Database write query failed:", error);
    return -1;
  }
}

/**
 * All screens will use this function to get all entries and
 * allow by search.
 * @param {SQLiteDatabase} - Database connection.
 * @param {string} tableName - The targeted table.
 * @param {getArgumentType} argument - Additional filters.
 * @returns {Promise<any[]>} - Returns the fetched entries.
 * If the fetch fails, returns [].
 */
export async function getAll(
  db: SQLiteDatabase,
  tableName: string,
  argument?: getArgumentType
): Promise<any[]> {
  let query = `SELECT q.*`;
  const params: string[] = [];
  const joins: string[] = [];

  if (relationships[tableName]) {
    // for each table look at foreign key to retrieve additional data (names...)
    relationships[tableName].joins.forEach(
      ({ table, foreignKey, type = "INNER", referenceField }) => {
        // join clause for specific table
        joins.push(
          `${type} JOIN ${table} ON q.${foreignKey} = ${table}.${foreignKey}`
        );

        // field converted to alias name
        if (referenceField) {
          query += `, ${table}.name AS ${referenceField}`;
        }
      }
    );
  }

  // add joins to query
  if (joins.length > 0) {
    query += ` FROM ${tableName} q ` + joins.join(" ");
  } else {
    query += ` FROM ${tableName} q`;
  }

  // add additional argument to query
  if (argument) {
    query += ` WHERE ${argument.columnName} ${argument.action} ?`;
    params.push(argument.value);
  }
  return await fetchByQuery(db, query, params);
}

/**
 * All screens will use this function to get insert entry.
 * @param {SQLiteDatabase} - Database connection.
 * @param {string} tableName - The targeted table.
 * @param {T} object - The entry needing inserted.
 * @returns {Promise<any[]>} - A promise that resolves to a number of last inserted row id.
 * If the write query fails, -1 is returned
 */
export async function insertEntry<T>(
  db: SQLiteDatabase,
  tableName: string,
  object: T
): Promise<any[]> {
  const columns = Object.keys(object).join(", "); // col1, col2, col3
  const params: any = Object.values(object); // [val1 , val2, val3]
  const paramHolders = params.map(() => "?").join(", "); // "?, ?, ?"

  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${paramHolders})`;
  return await fetchByQuery(db, query, params);
}

/**
 * All screens will use this function to get delete entry.
 * @param {SQLiteDatabase} - Database connection.
 * @param {string} tableName - The targeted table.
 * @param {getArgumentType} argument - Additional filters.
 * @returns {Promise<any[]>} - A promise that resolves to a number of last inserted row id.
 * If the write query fails, -1 is returned
 */
export async function deleteEntry(
  db: SQLiteDatabase,
  tableName: string,
  argument: getArgumentType
): Promise<any[]> {
  // convert to array if isn't already
  const columnNames = Array.isArray(argument.columnName)
    ? argument.columnName
    : [argument.columnName];
  const params = Array.isArray(argument.value)
    ? argument.value
    : [argument.value];

  const clause = columnNames
    .map((col, index) => `${col} ${argument.action} ?`)
    .join(" AND ");
  const query = `DELETE FROM ${tableName} WHERE ${clause}`;
  return await fetchByQuery(db, query, params);
}

/**
 * All screens will use this function to get delete entry.
 * @param {SQLiteDatabase} - Database connection.
 * @param {string} tableName - The targeted table.
 * @param {getArgumentType} argument - Additional filters.
 * @param {{ [key: string]: any }} updatingTo - The target columns where the values are updating.
 * @returns {Promise<any[]>} - A promise that resolves to a number of last inserted row id.
 * If the write query fails, -1 is returned
 */
export async function updateEntry(
  db: SQLiteDatabase,
  tableName: string,
  argument: getArgumentType,
  updatingTo: { [key: string]: any }
): Promise<any[]> {
  // convert to array if isn't already
  let params: any[] = [];
  const columnNames = Array.isArray(argument.columnName)
    ? argument.columnName
    : [argument.columnName];

  const whereClause = columnNames
    .map((col, index) => `${col} ${argument.action} ?`)
    .join(" AND ");

  const setClause = Object.keys(updatingTo)
    .map((column) => {
      params.push(updatingTo[column]);
      return `${column} = ?`;
    })
    .join(", ");

  // append at end for the whereClause
  params.push(
    ...(Array.isArray(argument.value) ? argument.value : [argument.value])
  );

  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
  return await fetchByQuery(db, query, params);
}
