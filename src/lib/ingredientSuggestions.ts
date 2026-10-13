export const INGREDIENT_SUGGESTIONS = [
  "all-purpose flour", "almond milk", "almonds", "anchovies", "apples", "arugula",
  "asparagus", "avocado", "bacon", "baking powder", "baking soda", "balsamic vinegar",
  "bananas", "basil", "bay leaves", "beef", "beets", "bell peppers", "black beans",
  "black pepper", "blueberries", "bread", "broccoli", "brown rice", "butter",
  "butternut squash", "cabbage", "canned tomatoes", "carrots", "cauliflower", "celery",
  "cheddar", "cheese", "chicken", "chicken breast", "chicken thighs", "chickpeas",
  "chili flakes", "cilantro", "cinnamon", "coconut milk", "coriander", "corn",
  "couscous", "cream", "cream cheese", "cucumber", "cumin", "dill", "eggplant",
  "eggs", "feta", "fish", "flour", "garlic", "ginger", "goat cheese", "green beans",
  "green onions", "ground beef", "heavy cream", "honey", "jalapeño", "kale", "kidney beans",
  "leeks", "lemons", "lentils", "lettuce", "limes", "maple syrup", "mayonnaise",
  "milk", "miso", "mozzarella", "mushrooms", "mustard", "oats", "olive oil", "onions",
  "oregano", "paprika", "parmesan", "parsley", "pasta", "peanut butter", "peanuts",
  "peas", "pecans", "pesto", "pine nuts", "pork", "potato", "potato starch", "quinoa",
  "red onions", "red wine vinegar", "rice", "ricotta", "rosemary", "salmon", "scallions",
  "shallots", "shrimp", "soy sauce", "spinach", "stock", "sweet potato", "tahini",
  "thyme", "tofu", "tomato paste", "tomatoes", "tortillas", "tuna", "turkey", "walnuts",
  "white beans", "white rice", "white wine", "yogurt", "zucchini",
] as const;

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export const getIngredientSuggestions = (
  input: string,
  selected: string[],
  limit = 5,
): string[] => {
  const query = normalize(input.split(",").at(-1) || "");
  if (query.length < 2) return [];

  const selectedSet = new Set(selected.map(normalize));

  return INGREDIENT_SUGGESTIONS
    .filter((ingredient) => {
      const normalized = normalize(ingredient);
      return !selectedSet.has(normalized) &&
        normalized !== query &&
        (normalized.startsWith(query) || normalized.split(/\s+/).some((word) => word.startsWith(query)));
    })
    .sort((a, b) => {
      const aStarts = normalize(a).startsWith(query) ? 0 : 1;
      const bStarts = normalize(b).startsWith(query) ? 0 : 1;
      return aStarts - bStarts || a.localeCompare(b);
    })
    .slice(0, limit);
};
