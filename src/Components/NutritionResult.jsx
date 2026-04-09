"use client";

export default function NutritionResult({ data, tdee }) {
    const meals = data.meals_log || [];
    const water = parseFloat(String(data.water)) || 0;

    const totals = meals.reduce(
        (acc, m) => ({
            kcal: acc.kcal + (parseFloat(String(m.kcal)) || 0),
            protein: acc.protein + (parseFloat(String(m.protein)) || 0),
            carb: acc.carb + (parseFloat(String(m.carb)) || 0),
            fat: acc.fat + (parseFloat(String(m.fat)) || 0),
        }),
        { kcal: 0, protein: 0, carb: 0, fat: 0 }
    );

    const targets = {
        kcal: tdee,
        protein: Math.round((tdee * 0.25) / 4),
        carb: Math.round((tdee * 0.45) / 4),
        fat: Math.round((tdee * 0.30) / 9),
        water: data.weight ? Math.round(data.weight * 35) : 2500,
    };

    const getStatus = (actual, target, tolerance = 0.15) => {
        const ratio = actual / target;
        if (ratio < 1 - tolerance) return { label: "Low", icon: "↓", cls: "status-low" };
        if (ratio > 1 + tolerance) return { label: "High", icon: "↑", cls: "status-high" };
        return { label: "Normal", icon: "✓", cls: "status-ok" };
    };

    const kcalStatus = getStatus(totals.kcal, targets.kcal);
    const proteinStatus = getStatus(totals.protein, targets.protein);
    const carbStatus = getStatus(totals.carb, targets.carb);
    const fatStatus = getStatus(totals.fat, targets.fat);
    const waterStatus = getStatus(water, targets.water);

    const getLevel = (s) =>
        s.label === "Normal" ? "normal" : s.label === "Low" ? "low" : "high";

    const tips = [];

    if (proteinStatus.label === "Low")
        tips.push(`Increase protein intake (target: ${targets.protein}g). Try chicken, eggs, or cottage cheese.`);
    if (proteinStatus.label === "High")
        tips.push("Reduce protein slightly to avoid unnecessary kidney strain.");

    if (carbStatus.label === "Low")
        tips.push("Add whole grains, fruits, or rice for more energy.");
    if (carbStatus.label === "High")
        tips.push("Reduce simple carbs and switch to complex carbohydrates.");

    if (fatStatus.label === "Low")
        tips.push("Include healthy fats like olive oil, avocado, or nuts.");
    if (fatStatus.label === "High")
        tips.push("Reduce fried foods and overall fat intake.");

    if (waterStatus.label === "Low")
        tips.push(`Drink at least ${targets.water} ml of water daily. You drank ${water} ml.`);

    if (kcalStatus.label === "Low")
        tips.push("Your calorie intake is too low. Consider eating more.");
    if (kcalStatus.label === "High")
        tips.push("You exceeded your calorie target. Watch portion sizes.");

    if (tips.length === 0)
        tips.push("Great! Your nutrition is well balanced today. Keep it up!");

    const isBalanced = [kcalStatus, proteinStatus, carbStatus, fatStatus]
        .every(s => s.label === "Normal");

    const barW = (actual, target) =>
        Math.min(Math.round((actual / target) * 100), 100);

    return (
        <div className="nut-wrapper">
            <div className="nut-container">

                <div className="nut-section">
                    <h2 className="nut-section-title">Daily Calorie Summary</h2>
                    <div className="nut-kcal-box">
                        <div className="nut-kcal-main">
                            <span className="nut-kcal-value">{Math.round(totals.kcal)}</span>
                            <span className="nut-kcal-label">kcal consumed</span>
                        </div>
                        <div className="nut-kcal-target">Target: {targets.kcal} kcal</div>
                        <div className="nut-progress-wrap">
                            <div className="nut-progress-track">
                                <div
                                    className={`nut-progress-fill ${kcalStatus.cls}`}
                                    style={{ width: `${barW(totals.kcal, targets.kcal)}%` }}
                                />
                            </div>
                            <span className={`nut-badge ${kcalStatus.cls}`}>
                                {kcalStatus.icon} {kcalStatus.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="nut-section">
                    <h2 className="nut-section-title">Macronutrients</h2>
                    <div className="nut-macro-grid">
                        {[
                            { label: "Protein", val: totals.protein, target: targets.protein, unit: "g", status: proteinStatus },
                            { label: "Carbs", val: totals.carb, target: targets.carb, unit: "g", status: carbStatus },
                            { label: "Fat", val: totals.fat, target: targets.fat, unit: "g", status: fatStatus },
                            { label: "Water", val: water, target: targets.water, unit: "ml", status: waterStatus },
                        ].map(({ label, val, target, unit, status }) => (
                            <div className="nut-macro-card" key={label}>
                                <div className="nut-macro-header">
                                    <span className="nut-macro-label">{label}</span>
                                    <span className={`nut-badge-sm ${status.cls}`}>{status.icon}</span>
                                </div>
                                <div className="nut-macro-value">
                                    {Math.round(val)}<span className="nut-macro-unit">{unit}</span>
                                </div>
                                <div className="nut-progress-track-sm">
                                    <div
                                        className={`nut-progress-fill ${status.cls}`}
                                        style={{ width: `${barW(val, target)}%` }}
                                    />
                                </div>
                                <div className="nut-macro-target">Target: {target} {unit}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="nut-section">
                    <h2 className="nut-section-title">Daily Comparison</h2>
                    <div className="nut-compare-list">
                        {[
                            { label: "Calories", actual: Math.round(totals.kcal), target: targets.kcal, unit: "kcal", status: kcalStatus },
                            { label: "Protein", actual: Math.round(totals.protein), target: targets.protein, unit: "g", status: proteinStatus },
                            { label: "Carbs", actual: Math.round(totals.carb), target: targets.carb, unit: "g", status: carbStatus },
                            { label: "Fat", actual: Math.round(totals.fat), target: targets.fat, unit: "g", status: fatStatus },
                            { label: "Water", actual: Math.round(water), target: targets.water, unit: "ml", status: waterStatus },
                        ].map(({ label, actual, target, unit, status }) => (
                            <div className="nut-compare-row" key={label}>
                                <span className="nut-compare-label">{label}</span>
                                <span className="nut-compare-values">{actual} / {target} {unit}</span>
                                <span className={`nut-badge ${status.cls}`}>{status.icon} {status.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="nut-section">
                    <h2 className="nut-section-title">Analysis</h2>
                    <div className="nut-analysis-box">
                        <div className="nut-analysis-main">
                            Your nutrition is{" "}
                            <strong className={isBalanced ? "text-success" : "text-warning"}>
                                {isBalanced ? "balanced" : "not balanced"}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="nut-section">
                    <h2 className="nut-section-title">Recommendations</h2>
                    <div className="nut-tips-list">
                        {tips.map((t, i) => (
                            <div className="nut-tip" key={i}>{t}</div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}