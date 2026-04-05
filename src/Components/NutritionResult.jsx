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
        if (ratio < 1 - tolerance) return { label: "Asagi", icon: "↓", cls: "status-low" };
        if (ratio > 1 + tolerance) return { label: "Yuksek", icon: "↑", cls: "status-high" };
        return { label: "Normal", icon: "✓", cls: "status-ok" };
    };

    const kcalStatus = getStatus(totals.kcal, targets.kcal);
    const proteinStatus = getStatus(totals.protein, targets.protein);
    const carbStatus = getStatus(totals.carb, targets.carb);
    const fatStatus = getStatus(totals.fat, targets.fat);
    const waterStatus = getStatus(water, targets.water);

    const getLevel = (s) =>
        s.label === "Normal" ? "normal" : s.label === "Asagi" ? "low" : "high";

    const tips = [];

    if (proteinStatus.label === "Asagi")
        tips.push(`Protein qebulunu artirin (hedef: ${targets.protein}q). Toyuq, yumurta ve ya kesmik yeyin.`);
    if (proteinStatus.label === "Yuksek")
        tips.push("Boyreklere elave yuk vermemek ucun proteini azca azaldin.");

    if (carbStatus.label === "Asagi")
        tips.push("Daha cox enerji ucun tam taxil, meyve ve ya duyu elave edin.");
    if (carbStatus.label === "Yuksek")
        tips.push("Sade karbohidratlari (seker, ag corek) azaldin ve kompleks karbohidratlara kecin.");

    if (fatStatus.label === "Asagi")
        tips.push("Zeytun yagi, avokado ve ya qoz kimi saglam yaglari daxil edin.");
    if (fatStatus.label === "Yuksek")
        tips.push("Qizardilmis yemeleri ve yag qebulunu azaldin.");

    if (waterStatus.label === "Asagi")
        tips.push(`Gundelik en az ${targets.water} ml su icin. Siz ${water} ml icdiniz.`);

    if (kcalStatus.label === "Asagi")
        tips.push("Kalori qebulunuz cox asagidir - daha cox yemek yemmeyi dusunun.");
    if (kcalStatus.label === "Yuksek")
        tips.push("Kalori hedefnizi kecdiniz - porsiya olculerine diqqet edin.");

    if (tips.length === 0)
        tips.push("Ela! Bu gun qidalamaniz cox yaxsi balanslasdirilib. Bele davam edin!");

    const isBalanced = [kcalStatus, proteinStatus, carbStatus, fatStatus]
        .every(s => s.label === "Normal");

    const barW = (actual, target) =>
        Math.min(Math.round((actual / target) * 100), 100);

    return (
        <div className="nut-wrapper">
            <div className="nut-container">

                {/* Kalori Xulasesi */}
                <div className="nut-section">
                    <h2 className="nut-section-title">Gundelik Kalori Xulasesi</h2>
                    <div className="nut-kcal-box">
                        <div className="nut-kcal-main">
                            <span className="nut-kcal-value">{Math.round(totals.kcal)}</span>
                            <span className="nut-kcal-label">kcal qebul edildi</span>
                        </div>
                        <div className="nut-kcal-target">Gundelik hedef: {targets.kcal} kcal</div>
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

                {/* Makronutrientler */}
                <div className="nut-section">
                    <h2 className="nut-section-title">Makronutrientler</h2>
                    <div className="nut-macro-grid">
                        {[
                            { label: "Protein", val: totals.protein, target: targets.protein, unit: "g", status: proteinStatus },
                            { label: "Karbohidrat", val: totals.carb, target: targets.carb, unit: "g", status: carbStatus },
                            { label: "Yag", val: totals.fat, target: targets.fat, unit: "g", status: fatStatus },
                            { label: "Su", val: water, target: targets.water, unit: "ml", status: waterStatus },
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
                                <div className="nut-macro-target">Hedef: {target} {unit}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gundelik Muqayise */}
                <div className="nut-section">
                    <h2 className="nut-section-title">Gundelik Muqayise</h2>
                    <div className="nut-compare-list">
                        {[
                            { label: "Kalori", actual: Math.round(totals.kcal), target: targets.kcal, unit: "kcal", status: kcalStatus },
                            { label: "Protein", actual: Math.round(totals.protein), target: targets.protein, unit: "g", status: proteinStatus },
                            { label: "Karbohidrat", actual: Math.round(totals.carb), target: targets.carb, unit: "g", status: carbStatus },
                            { label: "Yag", actual: Math.round(totals.fat), target: targets.fat, unit: "g", status: fatStatus },
                            { label: "Su", actual: Math.round(water), target: targets.water, unit: "ml", status: waterStatus },
                        ].map(({ label, actual, target, unit, status }) => (
                            <div className="nut-compare-row" key={label}>
                                <span className="nut-compare-label">{label}</span>
                                <span className="nut-compare-values">{actual} / {target} {unit}</span>
                                <span className={`nut-badge ${status.cls}`}>{status.icon} {status.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analiz */}
                <div className="nut-section">
                    <h2 className="nut-section-title">Analiz</h2>
                    <div className="nut-analysis-box">
                        <div className="nut-analysis-main">
                            Qidalamaniz{" "}
                            <strong className={isBalanced ? "text-success" : "text-warning"}>
                                {isBalanced ? "balanslasdirilib" : "balanslasdirilamayib"}
                            </strong>
                        </div>
                        <div className="nut-analysis-grid">
                            {[
                                { label: "Protein", level: getLevel(proteinStatus) },
                                { label: "Karbohidrat", level: getLevel(carbStatus) },
                                { label: "Yag", level: getLevel(fatStatus) },
                            ].map(({ label, level }) => (
                                <div className="nut-analysis-item" key={label}>
                                    <span className="nut-analysis-key">{label}:</span>
                                    <span className={`nut-analysis-val level-${level}`}>{level === "normal" ? "Normal" : level === "low" ? "Asagi" : "Yuksek"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tovsiyeler */}
                <div className="nut-section">
                    <h2 className="nut-section-title">Tovsiyeler</h2>
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