export interface Product {
  product_id: number;
  name: string;
}

export interface Meal {
  meal_id: number;
  create_at: string;
  update_at: string;
  photo_url: string;
  name: string;
  description: string;
}

export type Ingredient = {
  ingredient_name: string;
  quantity: number | string;
  unit_name: string | null;
};

export interface MealWithIngredients extends Meal {
  ingredients: Ingredient[];
}
