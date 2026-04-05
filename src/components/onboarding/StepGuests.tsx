interface Props {
  value: number | null;
  onChange: (v: number) => void;
}

const options = [2, 4, 6, 8];

const StepGuests = ({ value, onChange }: Props) => (
  <div className="space-y-8">
    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
      How many people are you hosting?
    </h1>
    <div className="flex flex-wrap gap-3">
      {options.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-20 h-20 rounded-2xl text-2xl font-bold border-2 transition-all ${
            value === n
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
              : "bg-card text-foreground border-border hover:border-primary/50"
          }`}
        >
          {n === 8 ? "8+" : n}
        </button>
      ))}
    </div>
  </div>
);

export default StepGuests;
