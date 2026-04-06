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

    const systemPrompt = `You are Poko, a calm, helpful dinner party planning assistant. Your tone is warm but minimal.

Your job: Given ingredients, number of guests, effort level, cooking skill, and an optional cuisine preference, create a clear cooking timeline of 3-4 dishes.

You must NOT return free text. Return structured JSON in this exact format:

{
  "menu": [
    {
      "dish": "Dish name",
      "category": "starter" | "main" | "side" | "dessert",
      "start_time": "e.g. '1 hour before'",
      "priority": 1,
      "ingredients_used": ["ingredient1", "ingredient2"],
      "missing_ingredients": ["ingredient3"],
      "savings": 5,
      "reason": "short explanation of why this dish is placed here"
    }
  ],
  "summary": {
    "total_savings": 15,
    "optimization_note": "short sentence explaining how this reduces effort"
  }
}

Rules:
- Prioritize dishes that take longer first (highest priority = 1)
- Avoid overlapping complex steps
- Prefer pantry ingredients from what the user listed
- Keep the plan simple and realistic for the selected effort level
- Limit to 3-4 dishes max
- start_time must be relative (e.g. "2 hours before", "45 min before", "15 min before", "Just before serving")
- savings = estimated dollar amount saved by using pantry ingredients for this dish (use 0 if none)
- ingredients_used = ingredients from the user's list that this dish uses
- missing_ingredients = items they need to buy
- reason = one short sentence explaining the timeline placement
- Adapt complexity based on cooking skill:
  - Beginner: very simple dishes, minimal steps
  - Intermediate: moderate complexity
  - Advanced: more creative, multi-step elements welcome`;

    const userPrompt = `Here's what we're working with:
- Guests: ${guests} people
- Ingredients available: ${ingredients}
- Effort level: ${effort || "medium"}
- Cooking skill: ${skill || "intermediate"}
- Cuisine vibe: ${cuisine || "Surprise me!"}

Create the cooking timeline!`;

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

    let parsed;
    try {
      parsed = JSON.parse(content.trim());
    } catch {
      try {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1].trim());
        } else {
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
