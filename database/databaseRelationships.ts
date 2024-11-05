interface DatabaseJoin {
  table: string;
  foreignKey: string;
  type?: "INNER" | "LEFT";
  referenceField?: string;
}

interface DatabaseRelationship {
  joins: DatabaseJoin[];
}

interface DatabaseRelationships {
  [tableName: string]: DatabaseRelationship;
}

export const relationships: DatabaseRelationships = {
  ingredient: {
    joins: [
      {
        table: "product",
        foreignKey: "product_id",
        referenceField: "product_name",
      },
      {
        table: "unit_of_measure",
        foreignKey: "unit_of_measure_id",
        type: "LEFT",
        referenceField: "unit_of_measure_name",
      },
    ],
  },
  shopping_cart: {
    joins: [
      {
        table: "meals",
        foreignKey: "meal_id",
        referenceField: "meal_name",
      },
      {
        table: "product",
        foreignKey: "product_id",
        referenceField: "product_name",
      },
      {
        table: "unit_of_measure",
        foreignKey: "unit_of_measure_id",
        type: "LEFT",
        referenceField: "unit_name",
      },
    ],
  },
  calendar: {
    joins: [
      {
        table: "meals",
        foreignKey: "meal_id",
        referenceField: "meal_name",
      },
    ],
  },
};
