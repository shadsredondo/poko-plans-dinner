interface Props {
  value: number | null;
  onChange: (v: number) => void;
}

const options = [2, 4, 6, 8];

const StepGuests = ({ value, onChange }: Props) => (
  <div className="space-y-12">
    <div className="space-y-4">
      <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Gathering</p>
      <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground leading-[1.05]">
        How many people are you expecting at the party?
      </h1>
    </div>
    <div className="grid grid-cols-4 gap-px bg-border">
      {options.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`aspect-square flex items-center justify-center font-display text-3xl transition-colors duration-300 ${
            value === n
              ? "bg-foreground text-background"
              : "bg-background text-foreground hover:bg-muted"
          }`}
        >
          {n === 8 ? "8+" : n}
        </button>
      ))}
    </div>
  </div>
);

export default StepGuests;
