interface Props {
  value: string;
  onChange: (v: string) => void;
}

const options = [
  { label: "Assembler", value: "beginner", desc: "Simple plates, light hand" },
  { label: "Comfortable", value: "intermediate", desc: "At ease with most recipes" },
  { label: "Practiced", value: "advanced", desc: "The kitchen is familiar terrain" },
];

const StepSkill = ({ value, onChange }: Props) => (
  <div className="space-y-12">
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Hand</p>
      <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground leading-[1.05]">
        How well do you cook?
      </h1>
    </div>
    <div className="border-t border-border">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full text-left flex items-baseline justify-between gap-6 py-6 border-b border-border transition-colors group ${
            value === opt.value ? "bg-muted/50" : "hover:bg-muted/30"
          }`}
        >
          <div className="flex items-baseline gap-6 px-2">
            <span className={`font-display text-2xl transition-colors ${
              value === opt.value ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"
            }`}>
              {opt.label}
            </span>
            <span className="text-sm text-muted-foreground italic">{opt.desc}</span>
          </div>
          <span className={`text-[10px] uppercase tracking-[0.24em] pr-2 transition-opacity ${
            value === opt.value ? "opacity-100 text-foreground" : "opacity-0"
          }`}>
            Selected
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default StepSkill;
