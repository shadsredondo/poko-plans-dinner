import { describe, expect, it } from "vitest";
import { getIngredientSuggestions } from "@/lib/ingredientSuggestions";

describe("getIngredientSuggestions", () => {
  it("suggests food ingredients from a prefix", () => {
    expect(getIngredientSuggestions("pot", [])).toEqual([
      "potato",
      "potato starch",
      "sweet potato",
    ]);
  });

  it("matches the last item in a comma-separated input", () => {
    expect(getIngredientSuggestions("chicken, tom", [])).toContain("tomatoes");
  });

  it("does not suggest ingredients already selected", () => {
    expect(getIngredientSuggestions("tom", ["tomatoes"])).not.toContain("tomatoes");
  });

  it("waits until at least two characters are entered", () => {
    expect(getIngredientSuggestions("p", [])).toEqual([]);
  });
});
