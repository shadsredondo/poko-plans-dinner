interface Props {
  value: string;
  onChange: (v: string) => void;
}

const options = [
  { label: "🥗 Assembler", value: "beginner", desc: "Very simple, minimal cooking" },
  { label: "🍳 Comfortable", value: "intermediate", desc: "Can follow recipes and improvise" },
  { label: "👨‍🍳 Pro chef", value: "advanced", desc: "Knows the kitchen inside out" },
];

const StepSkill = ({ value, onChange }: Props) => (
  <div className="space-y-8">
    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
      What's your cooking level?
    </h1>
    <div className="space-y-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full text-left rounded-2xl px-6 py-5 border-2 transition-all ${
            value === opt.value
              ? "bg-primary/10 border-primary shadow-md"
              : "bg-card border-border hover:border-primary/50"
          }`}
        >
          <span className="text-lg font-bold text-foreground">{opt.label}</span>
          <p className="text-sm text-muted-foreground mt-0.5">{opt.desc}</p>
        </button>
      ))}
    </div>
  </div>
);

export default StepSkill;
