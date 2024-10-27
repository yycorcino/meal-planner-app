import { type SQLiteDatabase } from "expo-sqlite";

/* 
Create all the tables and default data. 

For more information: https://docs.expo.dev/versions/latest/sdk/sqlite/#usesqlitecontext-hook
*/
async function migrateDatabase(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  // current version is already up to date, return
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // create data if first version
  if (currentDbVersion === 0) {
    await db.execAsync(`PRAGMA journal_mode = 'wal';`);

    // create tables
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS unit_of_measure (
          unit_of_measure_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(64)
        );
        CREATE TABLE IF NOT EXISTS product (
          product_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(128)
        );
        CREATE TABLE IF NOT EXISTS lists (
          list_id INTEGER PRIMARY KEY,
          name VARCHAR(128),
          list_of_meal_ids JSON,
          description JSON
        );
        CREATE TABLE IF NOT EXISTS meals (
          meal_id INTEGER PRIMARY KEY,
          create_at TEXT,
          update_at TEXT,
          photo_url TEXT,
          name VARCHAR(128),
          description TEXT
        );
        CREATE TABLE IF NOT EXISTS ingredient (
          meal_id INTEGER,
          product_id INTEGER,
          quantity INTEGER,
          unit_of_measure_id INTEGER,
          FOREIGN KEY (meal_id) REFERENCES meals(meal_id),
          FOREIGN KEY (unit_of_measure_id) REFERENCES unit_of_measure(unit_of_measure_id),
          FOREIGN KEY (product_id) REFERENCES product(product_id),
          PRIMARY KEY (meal_id, product_id)
        );
        CREATE TABLE IF NOT EXISTS shopping_cart (
          meal_id INTEGER,
          product_id INTEGER,
          quantity INTEGER,
          unit_of_measure_id INTEGER,
          in_cart INTEGER,
          FOREIGN KEY (meal_id) REFERENCES meals(meal_id),
          FOREIGN KEY (product_id) REFERENCES product(product_id),
          FOREIGN KEY (unit_of_measure_id) REFERENCES unit_of_measure(unit_of_measure_id),
          PRIMARY KEY (meal_id, product_id)
        );
        CREATE TABLE IF NOT EXISTS calendar (
          meal_id INTEGER,
          plan_at TEXT,
          FOREIGN KEY (meal_id) REFERENCES meals(meal_id),
          PRIMARY KEY (meal_id, plan_at)
        );
      `);

    // insert default measurements into unit_of_measure table
    const unitOfMeasureInserts = `
        INSERT INTO unit_of_measure (name) VALUES 
        ('tsp'), 
        ('cup'), 
        ('tbsp'), 
        ('oz'), 
        ('can'), 
        ('lb'), 
        ('liter'), 
        ('g'), 
        ('slice'), 
        ('mL'), 
        ('stick'), 
        ('piece');
      `;
    await db.execAsync(unitOfMeasureInserts);

    // insert default products into product table
    const productInserts = `
        INSERT INTO product (name) VALUES 
        ('Vegetable Oil'), 
        ('Salt'), 
        ('American Cheese'), 
        ('Baking Soda'), 
        ('Mayonnaise'), 
        ('All-Purpose Flour'), 
        ('Cane Sugar'), 
        ('Water'), 
        ('Brownie Mix'), 
        ('Butter'), 
        ('Shredded Cheese'), 
        ('Olive Oil'), 
        ('Wheat Bread'), 
        ('Brown Sugar'), 
        ('Large Egg'), 
        ('Pepper'), 
        ('Pizza Dough'), 
        ('Alfredo Sauce'), 
        ('Chicken Breast'), 
        ('Black Pepper'), 
        ('Mozzarella Cheese'), 
        ('Parmesan Cheese'), 
        ('Red Onion'), 
        ('Ground Chicken'), 
        ('Sun Dried Tomato Pesto'), 
        ('Flour Tortillas'), 
        ('Grape Tomatoes'), 
        ('Shredded Lettuce');
      `;
    await db.execAsync(productInserts);

    // insert default meals into meals table
    const mealsInserts = `
        INSERT INTO meals (create_at, update_at, photo_url, name, description) 
        VALUES 
        (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, 'Grilled Cheese', 'Mom’s Famous Grilled Cheese'),
        (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, 'Chicken Alfredo Pizza', NULL),
        (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, 'Chicken Pesto Wraps', NULL),
        (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, 'Tiramisu', 'Italian dessert made with ladyfingers dipped in coffee and layed in whipped mascarpone.'),
        (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, 'Pan-Seared Steak', 'New York steak with garlic rosemary-infused butter.');
      `;
    await db.execAsync(mealsInserts);

    // insert default ingredients into ingredients table (for above meals)
    const ingredientInserts = `
        INSERT INTO ingredient (meal_id, product_id, quantity, unit_of_measure_id) VALUES 
        (1, 3, 2, 9),
        (1, 5, 1, 1),
        (1, 13, 2, 12),
        (2, 17, 2, 6),
        (2, 18, 0.5, 2),
        (2, 19, 6, 4), 
        (2, 2, 1, 1), 
        (2, 20, 1, 1), 
        (2, 12, 2, 1), 
        (2, 21, 2, 2), 
        (2, 22, 0.5, 2), 
        (2, 6, 4, 1),
        (2, 23, 0.5, NULL),
        (3, 24, 0.5, 6), 
        (3, 12, 1, 1), 
        (3, 25, 0.25, 2), 
        (3, 26, 2, NULL), 
        (3, 21, 0.5, 2), 
        (3, 27, 8, NULL), 
        (3, 23, 2, 9), 
        (3, 28, 1, 2);
      `;
    await db.execAsync(ingredientInserts);

    // insert default list into lists table
    const listInserts = `
        INSERT INTO lists (name, list_of_meal_ids, description) 
        VALUES ('Home Favorites', '[2, 3, 5]', 'Meals I can eat any day.');
      `;
    await db.execAsync(listInserts);

    // insert copied items from ingredients into shopping cart table
    const shoppingCartInserts = `
        INSERT INTO shopping_cart (meal_id, product_id, quantity, unit_of_measure_id, in_cart)
        SELECT meal_id, product_id, quantity, unit_of_measure_id, 0
        FROM ingredient;
      `;
    await db.execAsync(shoppingCartInserts);
    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export default migrateDatabase;
