import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SCHEMA = `{
  "menu": [
    {
      "dish": "string",
      "category": "starter | main | side | dessert",
      "importance": "anchor | supporting",
      "priority": number,
      "start_time": "string (e.g. 1 hour before)",
      "start_time_minutes": number,
      "effort_level": "low | medium | high",
      "can_overlap": boolean,
      "ingredients_used": ["string"],
      "missing_ingredients": ["string"],
      "savings": number,
      "reason": "short phrase (max 3-5 words)"
    }
  ],
  "total_savings": number,
  "actions": [
    {
      "type": "buy | prep | cook | serve",
      "label": "short, clear action (e.g. 'Buy lemons and parsley')",
      "when": "human readable (e.g. '1 hour before')",
      "minutes_before_serving": number or null,
      "related_dish": "dish name or null"
    }
  ]
}`;

const RULES = `Rules:
- Return ONLY valid JSON. No explanations. No prose. No text outside JSON.
- Sort dishes by start_time_minutes descending (earliest/largest number first)
- Main dishes should have higher priority and importance = "anchor"
- Avoid overlapping multiple "high" effort dishes unless necessary
- Keep "reason" concise (no full sentences, max 3-5 words)
- Prefer pantry ingredients from what the user listed
- Limit to 3-4 dishes max
- ALL dishes must fit within the given time limit — no dish's start_time_minutes can exceed it
- start_time_minutes = minutes before serving (e.g. 90 for "1 hour 30 min before")
- Adapt complexity based on cooking skill:
  - Beginner: simple dishes, low effort
  - Intermediate: moderate complexity
  - Advanced: creative, multi-step elements

Savings rules:
- savings = estimated dollar amount saved per dish by using pantry ingredients
- If a dish uses ANY pantry ingredients, savings MUST be > 0 (estimate directionally, e.g. chicken=$3, rice=$1, tomatoes=$2, yogurt=$1)
- total_savings = sum of all dish savings, must reflect actual pantry usage across dishes
- Never return savings: 0 if pantry ingredients are used in a dish

Action rules:
- Always include 3-5 actions in the "actions" array
- Buy actions: Do NOT bundle all missing ingredients into one long label. Either create separate buy actions per dish OR group them into short, meaningful labels (e.g. "Buy spices & herbs", "Buy fresh produce for salad")
- Prep actions: Add for dishes needing early preparation. Label concisely (e.g. "Prep skillet ingredients", "Dice vegetables")
- Cook actions: Add only if meaningful and non-obvious (e.g. "Start chicken & rice skillet")
- Serve action: ALWAYS include exactly one final action with type "serve", a short label (e.g. "Plate and serve"), when "Serve time", and minutes_before_serving 0
- All action labels must be short, practical, and user-friendly — no long instructional sentences
- Good examples: "Buy lemons & parsley", "Prep skillet ingredients", "Make yogurt dip", "Plate and serve"
- Bad examples: "Purchase all necessary ingredients including onion, garlic, and chicken broth from the store"

Timing rules:
- Prep actions must have higher minutes_before_serving than cook actions
- Cook actions must align with dish start_time_minutes
- Actions must be ordered by minutes_before_serving descending
- Ensure action minutes_before_serving aligns with dish start_time_minutes`;

const SYSTEM_INITIAL = `You are Poko, a calm dinner party planning assistant.

Mode: INITIAL PLANNING
Generate a new menu plan from scratch based on the user's inputs.

Schema:
${SCHEMA}

${RULES}`;

const SYSTEM_MODIFY = `You are Poko, a calm dinner party planning assistant.

Mode: PLAN MODIFICATION
The user has an existing plan and wants to modify it.

Instructions:
- Preserve as much of the current plan as possible
- Change ONLY what is necessary to satisfy the new constraint
- Recalculate ALL affected fields: dish, category, importance, priority, start_time, start_time_minutes, effort_level, can_overlap, ingredients_used, missing_ingredients, savings, reason
- Always return the FULL updated plan (not just the changed parts)

Schema:
${SCHEMA}

${RULES}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { guests, ingredients, effort, skill, cuisine, time_limit, current_plan, modification } = await req.json();

    if (!ingredients || !guests) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const isModification = !!current_plan && !!modification;

    const systemPrompt = isModification ? SYSTEM_MODIFY : SYSTEM_INITIAL;

    let userPrompt: string;
    if (isModification) {
      userPrompt = `Current plan:
${JSON.stringify(current_plan, null, 2)}

Context:
Guests: ${guests}
Ingredients: ${ingredients}
Effort: ${effort || "medium"}
Skill: ${skill || "intermediate"}
Cuisine: ${cuisine || "Surprise me!"}
Time limit: ${time_limit || "no limit"}

Modification requested: ${modification}`;
    } else {
      userPrompt = `Guests: ${guests}
Ingredients: ${ingredients}
Effort: ${effort || "medium"}
Skill: ${skill || "intermediate"}
Cuisine: ${cuisine || "Surprise me!"}
Time limit: ${time_limit || "no limit"}`;
    }

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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", JSON.stringify(data).substring(0, 1000));
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
      } catch {
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
