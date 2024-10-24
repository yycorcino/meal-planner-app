import { SQLiteDatabase, SQLiteBindParams } from "expo-sqlite";


type preGetArgumentType = {
  columnName?: string;
  value?: any;
};

// allow for custom actions
type getArgumentType = {
  columnName?: string;
  action?: "LIKE" | "=";
  value?: any;
};

/*
 * A class for interacting with SQLite database.
 */
class DatabaseUtil {
  private db: SQLiteDatabase;
  private tableName: string;

  constructor(database: SQLiteDatabase, tableName: string) {
    this.db = database;
    this.tableName = tableName;
  }

  /**
   * Make fetch queries.
   * @param {string} query - The SQL statement to run on db.
   * @params {any[]} [params] - Additional params to include with query.
   * @returns {Promise<any[]>} -  A promise that resolves to a list of the query results.
   * If the fetch query fails, an empty array will be returned.
   */
  private async fetchByQuery(
    query: string,
    params: SQLiteBindParams
  ): Promise<any[]> {
    try {
      const result = await this.db.getAllAsync(query, params);
      return result;
    } catch (error) {
      console.error("Database fetch query failed:", error);
      return [];
    }
  }

  /**
   * Make write queries: insert, update, delete.
   * @param {string} query - The SQL statement to run on db.
   * @params {any[]} [params] - Additional params to include with query.
   * @returns {Promise<number>} -  A promise that resolves to a number of last inserted row id.
   * If the write query fails, -1 is returned
   */
  public async writeByQuery(
    query: string,
    params: SQLiteBindParams
  ): Promise<number> {
    try {
      const result = await this.db.runAsync(query, params);
      return result.lastInsertRowId;
    } catch (error) {
      console.error("Database write query failed:", error);
      return -1;
    }
  }

  public async getAll(argument?: getArgumentType): Promise<any[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: string[] = [];

    if (argument) {
      query += ` WHERE ${argument.columnName} ${argument.action} ?`;
      params.push(argument.value);
    }
    return await this.fetchByQuery(query, params);
  }
}

// getAll{Screens} will follow this layout
// or possibly just pass the table name
export async function getAllMeals(
  db: SQLiteDatabase,
  argument?: preGetArgumentType
) {
  const util = new DatabaseUtil(db, "meals");

  if (argument && argument.columnName && argument.value !== undefined) {
    return await util.getAll({
      columnName: argument.columnName,
      action: "LIKE",
      value: `%${argument.value}%`,
    });
  }
  return await util.getAll();
}

export async function getMeal(
  db: SQLiteDatabase,
  argument: preGetArgumentType
) {
  const util = new DatabaseUtil(db, "meals");
  return await util.getAll({
    columnName: argument.columnName,
    action: "=",
    value: argument.value,
  });
}

export async function getAllShoppingCart(db: SQLiteDatabase) {
  const util = new DatabaseUtil(db, "shopping_cart");
  return await util.getAll();
}

export async function setInCart(
  db: SQLiteDatabase,
  params: { mealId: number; productId: number }
) {
  const query = `
    UPDATE shopping_cart
    SET in_cart = 1
    WHERE meal_id = ? AND product_id = ?;
  `;

  const util = new DatabaseUtil(db, "shopping_cart");
  return await util.writeByQuery(query, [params.mealId, params.productId]);
}
