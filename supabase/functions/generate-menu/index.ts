import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { guests, ingredients, effort, skill, cuisine } = await req.json();
    
    if (!ingredients || !guests) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are Poko, a calm, helpful dinner party planning assistant. Your tone is warm but minimal — no long commentary, no playful menu names, no poetic descriptions.

Your job: Given ingredients, number of guests, effort level, cooking skill, and an optional cuisine preference, create a clean 3-4 course dinner party menu.

Rules:
- PRIORITIZE using the ingredients they already have
- Menu title: simple and descriptive (e.g. "Balanced Asian-Inspired Dinner", "Simple Vegetarian Hosting Menu"). No playful or exaggerated names.
- Dish descriptions: one short, functional line max. Practical and easy to understand. Not poetic.
- Ingredient tags: minimal, only key ingredients from the user's pantry
- Shopping list: only missing ingredients, max 5-6 items. No commentary.
- Plan: use friendly, simple language with relative time labels
- pokoComment: one short optional line only (e.g. "This should come together smoothly."). No long commentary.
- Adapt the menu complexity based on cooking skill:
  - Beginner: very simple dishes, minimal steps, minimal techniques. Fewer dishes, fewer ingredients, shorter cooking time. Never suggest complex techniques.
  - Intermediate: moderate complexity, some cooking steps, standard techniques
  - Advanced: more creative, multi-step, restaurant-style elements welcome

You MUST respond with valid JSON in exactly this format:
{
  "menuTitle": "Simple, descriptive menu name",
  "courses": [
    {
      "type": "starter" | "main" | "side" | "dessert",
      "name": "Dish name",
      "description": "One short functional description",
      "keyIngredients": [
        { "name": "ingredient1", "fromPantry": true, "estimatedCost": 0 },
        { "name": "ingredient2", "fromPantry": false, "estimatedCost": 2.5 }
      ],
      "estimatedCost": 8,
      "pantrySavings": 5
    }
  ],
  "shoppingList": ["item1", "item2"],
  "totalEstimatedCost": 30,
  "totalPantrySavings": 15,
  "plan": [
    { "time": "2 hours before", "task": "What to do" },
    { "time": "45 mins before", "task": "What to do" },
    { "time": "15 mins before", "task": "What to do" },
    { "time": "Serve", "task": "Plate up and enjoy!" }
  ],
  "pokoComment": "One short, optional line"
}

For cost estimates:
- estimatedCost per ingredient: realistic USD estimate for a typical grocery store
- fromPantry: true if the ingredient matches what the user listed as available
- pantrySavings per dish: sum of estimatedCost for fromPantry ingredients
- totalEstimatedCost: sum of all ingredient costs across all dishes
- totalPantrySavings: sum of all pantrySavings across all dishes
- Keep estimates simple, rounded, and believable`;

    const userPrompt = `Here's what we're working with:
- Guests: ${guests} people
- Ingredients available: ${ingredients}
- Effort level: ${effort || "medium"}
- Cooking skill: ${skill || "intermediate"}
- Cuisine vibe: ${cuisine || "Surprise me!"}

Create an amazing dinner party menu!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Poko's brain is a bit overloaded. Try again in a moment!" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Poko needs more credits to keep cooking. Please top up!" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("AI response structure:", JSON.stringify(data).substring(0, 500));
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response. Full response:", JSON.stringify(data).substring(0, 1000));
      throw new Error("AI returned empty response");
    }

    // Robust JSON extraction
    let parsed;
    try {
      // Try direct parse first
      parsed = JSON.parse(content.trim());
    } catch {
      try {
        // Try extracting from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1].trim());
        } else {
          // Try finding JSON object boundaries
          const start = content.indexOf('{');
          const end = content.lastIndexOf('}');
          if (start !== -1 && end !== -1) {
            parsed = JSON.parse(content.substring(start, end + 1));
          } else {
            throw new Error("No JSON found");
          }
        }
      } catch (e2) {
        console.error("Failed to parse AI response:", content.substring(0, 500));
        throw new Error("Failed to parse menu");
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-menu error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Something went wrong" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
