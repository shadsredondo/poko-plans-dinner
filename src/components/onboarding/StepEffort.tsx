interface Props {
  value: string;
  onChange: (v: string) => void;
}

const options = [
  { label: "😌 Chill", value: "minimal", desc: "Keep it simple and easy" },
  { label: "🍳 Moderate", value: "moderate", desc: "Some effort, good results" },
  { label: "🔥 All in", value: "high", desc: "Let's impress everyone" },
];

const StepEffort = ({ value, onChange }: Props) => (
  <div className="space-y-8">
    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
      How much effort are we putting in?
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

export default StepEffort;
