import { SQLiteDatabase } from "expo-sqlite";

async function executeByQuery(db: SQLiteDatabase, query: string) {
  /*
    Using the connection execute query. 
    Args:
        db: The connection instance to cookbook.db.
        query (str): The SQL statement to run on db.
    Returns: 
        list: A list of data retrieved based by query.
     */

  try {
    const result = await db.getAllAsync(query);
    return result;
  } catch (error) {
    return [];
  }
}

export async function getAllMeals(db: SQLiteDatabase) {
  const query = "SELECT * FROM meals;";
  const meals = await executeByQuery(db, query);
  return meals;
}

export async function getShoppingCart(db: SQLiteDatabase) {
  const query = "SELECT * FROM shopping_cart;";
  const cart = await executeByQuery(db, query);
  return cart;
}
