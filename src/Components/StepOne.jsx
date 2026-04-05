function Field({ id, label, error, children }) {
    return (
        <div className={`hc-field${error ? " hc-field--error" : ""}`} id={id}>
            <label>{label}</label>
            {children}
            {error && <span className="hc-field-error">{error}</span>}
        </div>
    );
}

function RangeInput({ id, min, max, value, unit, onChange }) {
    const percentage = ((value - min) / (max - min)) * 100;
    const gradient = `linear-gradient(to right, var(--primary) ${percentage}%, var(--border) ${percentage}%)`;

    return (
        <div className="hc-range-wrap">
            <input
                type="range"
                id={id}
                min={min}
                max={max}
                value={value}
                style={{ background: gradient }}
                onChange={(e) => onChange(Number(e.target.value))}
            />
            <div className="hc-range-value">{value}</div>
            <span className="hc-range-unit">{unit}</span>
        </div>
    );
}

export default function StepOne({ step, data, update, errors }) {
    if (step === 1) {
        return (
            <>
                <div className="hc-step-icon">👤</div>
                <h2 className="hc-step-title">Personal Information</h2>
                <p className="hc-step-sub">A few details about you.</p>

                <Field label="Name" error={errors.name}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={data.name}
                        onChange={(e) => update("name", e.target.value)}
                    />
                </Field>

                <div className="hc-field-row">
                    <Field label="Age" error={errors.age}>
                        <input
                            type="number"
                            placeholder="25"
                            min="10"
                            max="100"
                            value={data.age}
                            onChange={(e) => update("age", e.target.value)}
                        />
                    </Field>

                    <Field label="Gender" error={errors.gender}>
                        <select
                            value={data.gender}
                            onChange={(e) => update("gender", e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </Field>
                </div>
            </>
        );
    }

    return (
        <div className="step-one">
            <div className="hc-step-icon">📏</div>
            <h2 className="hc-step-title">Physical Metrics</h2>
            <p className="hc-step-sub">Enter your height and weight.</p>

            <Field label="Height">
                <RangeInput
                    id="height"
                    min={140}
                    max={220}
                    value={data.height}
                    unit="cm"
                    onChange={(v) => update("height", v)}
                />
            </Field>

            <Field label="Weight">
                <RangeInput
                    id="weight"
                    min={30}
                    max={200}
                    value={data.weight}
                    unit="kg"
                    onChange={(v) => update("weight", v)}
                />
            </Field>
        </div>
    );
}