function PillGroup({ options, selected, onSelect }) {
    return (
        <div className="hc-pill-group">
            {options.map(([value, label]) => (
                <button
                    key={value}
                    type="button"
                    className={`hc-pill${selected === value ? " hc-pill--selected" : ""}`}
                    onClick={() => onSelect(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div className={`hc-field${error ? " hc-field--error" : ""}`}>
            <label>{label}</label>
            {children}
            {error && <span className="hc-field-error">{error}</span>}
        </div>
    );
}

export default function StepThree({ data, update, errors }) {
    return (
        <>
            <div className="hc-step-icon">🏋️</div>
            <h2 className="hc-step-title">Exercise Habits</h2>
            <p className="hc-step-sub">Final step — your fitness routine.</p>

            <Field label="Do you exercise?" error={errors.exercises}>
                <PillGroup
                    options={[
                        ["yes", "✅ Yes"],
                        ["no", "❌ No"],
                    ]}
                    selected={data.exercises}
                    onSelect={(v) => update("exercises", v)}
                />
            </Field>

            {data.exercises === "yes" && (
                <>
                    <Field label="How often per week">
                        <PillGroup
                            options={[
                                ["1-2", "1–2 days"],
                                ["3-4", "3–4 days"],
                                ["5+", "5+ days"],
                            ]}
                            selected={data.exFreq}
                            onSelect={(v) => update("exFreq", v)}
                        />
                    </Field>

                    <Field label="Exercise Type">
                        <PillGroup
                            options={[
                                ["gym", "🏋️ Gym"],
                                ["cardio", "🏃 Cardio"],
                                ["home", "🏠 Home Workout"],
                                ["mix", "🔀 Mixed"],
                            ]}
                            selected={data.exType}
                            onSelect={(v) => update("exType", v)}
                        />
                    </Field>
                </>
            )}
        </>
    );
}