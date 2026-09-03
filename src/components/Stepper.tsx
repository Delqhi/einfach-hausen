const steps = ["Firmendaten", "Leistungen", "Arbeitsgebiet", "Abschluss"];

export default function Stepper({ current }: { current: number }) {
  return (
    <div className="stepper">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "active" : "todo";
        return (
          <div className="step" key={label}>
            {i > 0 && <div className={`step-line ${n <= current ? "filled" : ""}`} />}
            <div className={`step-circle ${state}`}>{n}</div>
            <span className={`step-label ${state}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
