const FILLER_PATTERNS = [
  /\bsome\b/gi,
  /\ba bit of\b/gi,
  /\bleftover\b/gi,
  /\bleftovers?\b/gi,
  /\blike\b/gi,
  /\bmaybe\b/gi,
  /\bprobably\b/gi,
  /\bi think\b/gi,
  /\bi guess\b/gi,
  /\bi have\b/gi,
  /\bi've got\b/gi,
  /\bthere's\b/gi,
  /\bthere is\b/gi,
  /\ba couple of\b/gi,
  /\ba few\b/gi,
  /\bhalf a\b/gi,
  /\bhalf an\b/gi,
  /\bum+\b/gi,
  /\buh+\b/gi,
];

export function cleanIngredients(raw: string): string {
  let cleaned = raw;
  for (const pattern of FILLER_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }
  // Normalize separators: "and" → comma
  cleaned = cleaned.replace(/\band\b/gi, ",");
  // Collapse whitespace and commas
  cleaned = cleaned
    .replace(/[,\s]+/g, " ")
    .trim()
    .split(/\s{2,}/)
    .join(", ");
  // Re-split by remaining natural breaks and rejoin
  const parts = cleaned
    .split(/,/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.join(", ");
}
