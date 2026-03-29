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

    const systemPrompt = `You are Poko, a friendly, slightly witty (think British humour) dinner party planning companion. You make cooking feel easy and exciting.

Your job: Given a list of ingredients someone already has, the number of guests, their effort level, and an optional cuisine vibe, create a brilliant 3-4 course dinner party menu.

You will also receive a cooking skill level (beginner / intermediate / advanced).

Rules:
- PRIORITIZE using the ingredients they already have
- Keep the additional shopping list MINIMAL (max 5-7 items)
- Keep recipes realistic and not overly complex
- Match complexity to their stated effort level
- Be playful and encouraging in your commentary
- Adapt the menu complexity based on cooking skill:
  - Beginner: very simple dishes, minimal steps, minimal techniques. Prioritize fewer dishes, fewer ingredients, shorter cooking time. Never suggest complex techniques (e.g., slow braising, advanced sauces, tempering chocolate).
  - Intermediate: moderate complexity, some cooking steps, comfortable with standard techniques
  - Advanced: more creative, multi-step, restaurant-style elements, advanced techniques welcome

You MUST respond with valid JSON in exactly this format:
{
  "pokoReaction": "A short, witty reaction to their ingredients (1-2 sentences, British humour)",
  "menuTitle": "A fun name for the dinner party menu",
  "courses": [
    {
      "type": "starter" | "main" | "side" | "dessert",
      "name": "Dish name",
      "description": "Brief appetizing description (1 sentence)",
      "keyIngredients": ["ingredient1", "ingredient2"],
      "fromFridge": true/false (whether mostly from their existing ingredients)
    }
  ],
  "shoppingList": ["item1", "item2"],
  "timeline": [
    { "time": "T-2hrs", "task": "What to do" },
    { "time": "T-1hr", "task": "What to do" },
    { "time": "T-30min", "task": "What to do" },
    { "time": "T-0", "task": "Serve and enjoy!" }
  ],
  "pokoTip": "A final encouraging tip from Poko"
}`;

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
