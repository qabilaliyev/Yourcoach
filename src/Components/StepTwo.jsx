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

export default function StepTwo({ step, data, update, errors }) {
    if (step === 3) {
        return (
            <>
                <div className="hc-step-icon">🎯</div>
                <h2 className="hc-step-title">Goal & Activity</h2>
                <p className="hc-step-sub">What do you want to achieve?</p>

                <Field label="Your Goal" error={errors.goal}>
                    <PillGroup
                        options={[
                            ["lose", "🔥 Lose Weight"],
                            ["gain", "💪 Gain Weight"],
                            ["maintain", "⚖️ Maintain"],
                            ["muscle", "🏋️ Build Muscle"],
                        ]}
                        selected={data.goal}
                        onSelect={(v) => update("goal", v)}
                    />
                </Field>

                <Field label="Activity Level" error={errors.activity}>
                    <PillGroup
                        options={[
                            ["sedentary", "🛋️ Very Low"],
                            ["light", "🚶 Light"],
                            ["moderate", "🏃 Active"],
                            ["very", "⚡ Very Active"],
                        ]}
                        selected={data.activity}
                        onSelect={(v) => update("activity", v)}
                    />
                </Field>
            </>
        );
    }

    return (
        <>
            <div className="hc-step-icon">🍽</div>
            <h2 className="hc-step-title">Nutrition & Lifestyle</h2>
            <p className="hc-step-sub">Your daily habits.</p>

            <Field label="Meals per Day" error={errors.meals}>
                <PillGroup
                    options={[
                        ["1-2", "1–2 meals"],
                        ["3", "3 meals"],
                        ["4-5", "4–5 meals"],
                        ["6+", "6+ meals"],
                    ]}
                    selected={data.meals}
                    onSelect={(v) => update("meals", v)}
                />
            </Field>

            <Field label="Diet Type" error={errors.diet}>
                <PillGroup
                    options={[
                        ["normal", "🍖 Regular"],
                        ["vegetarian", "🥦 Vegetarian"],
                        ["vegan", "🌱 Vegan"],
                    ]}
                    selected={data.diet}
                    onSelect={(v) => update("diet", v)}
                />
            </Field>

            <Field label="Stress Level" error={errors.stress}>
                <PillGroup
                    options={[
                        ["low", "😌 Low"],
                        ["medium", "😐 Moderate"],
                        ["high", "😤 High"],
                    ]}
                    selected={data.stress}
                    onSelect={(v) => update("stress", v)}
                />
            </Field>
        </>
    );
}