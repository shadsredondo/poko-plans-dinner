# Poko's Pantry

AI hosting & pantry assistant — turns the ingredients you already have into a thoughtful dinner-party menu, a cooking timeline, and a shopping plan.

## The Problem

Hosting is mostly logistics, not cooking. The hard parts are deciding what to make from what's on hand, sequencing the cooking so everything's ready at once, and figuring out the short list of things you still need to buy. Recipe apps optimize for discovery; they don't help you *host*.

## Product Hypothesis

People don't need another recipe search. They need a plan. If you start from "here's what I have and who's coming," the useful output is a coherent menu, a timeline, and a tight shopping list — not a wall of recipe options.

## Who This Is For

- People hosting a small dinner who want to cook from what they have
- Anyone who finds the *planning* harder than the *cooking*

## How It Works

1. Enter the ingredients you have on hand
2. Add context — number of guests, any constraints
3. Poko generates a menu, a cooking timeline, and a shopping list
4. Personalization tailors suggestions to the occasion

## Product Decisions & Tradeoffs

The most important decision was **how little to use AI.**

- **Rule-based logic for the heavy lifting.** Ingredient matching, menu structure, and timeline sequencing are deterministic — they don't need an LLM, and using one would have added cost, latency, and a failure surface for no quality gain.
- **AI reserved for personalization only** — the layer where natural-language nuance actually earns its keep.
- **Why it matters:** treating "AI-powered" as a default would have made the product slower, more expensive, and less reliable. Scoping the LLM to where it's genuinely differentiated is the real product call.

## Tech Stack

- React / TypeScript
- Claude API (personalization)
- Vercel

## Demo

https://poko-plans-dinner.vercel.app/

## What's Next

- **V2 → agentic workflow:** let the assistant ask clarifying questions, adjust the plan as constraints change, and handle multi-course sequencing dynamically
- Substitution suggestions when an ingredient is missing
- Save and revisit past menus
