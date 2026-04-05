import React from 'react'
import { useNavigate } from 'react-router-dom'
import NutritionResult from './NutritionResult'
import PlanDashboard from './PlanDashboard'
import "../Style/Calculator.css"
import "../Style/Main.css"
import "../Style/PlanDashboard.css"

function calcBMI(height, weight) {
    const h = height / 100;
    return (weight / (h * h)).toFixed(1);
}

function getBMIStatus(bmi) {
    if (bmi < 18.5) return ["Underweight", "status-underweight"];
    if (bmi < 25) return ["Normal", "status-normal"];
    if (bmi < 30) return ["Overweight", "status-overweight"];
    return ["Obese", "status-obese"];
}

function calcTDEE(data) {
    const w = +data.weight, h = +data.height, a = +data.age;
    let bmr = data.gender === "female"
        ? 447.6 + 9.2 * w + 3.1 * h - 4.3 * a
        : 88.4 + 13.4 * w + 4.8 * h - 5.7 * a;
    const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 }[data.activity] || 1.375;
    return Math.round(bmr * mult);
}

function getGoalCalories(tdee, goal) {
    return { lose: tdee - 500, gain: tdee + 400, maintain: tdee, muscle: tdee + 250 }[goal] || tdee;
}

const goalLabels = {
    lose: "Lose Weight",
    gain: "Gain Weight",
    maintain: "Maintain",
    muscle: "Build Muscle"
};

export default function ResultPage() {
    const navigate = useNavigate();
    const data = JSON.parse(sessionStorage.getItem('calcData') || 'null');

    if (!data) {
        return (
            <div className="hc-wrap">
                <div className="hc-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#64748b', marginBottom: 24 }}>No data found. Please start from the beginning.</p>
                    <button className="hc-btn-restart" onClick={() => navigate('/calculator')}>Go to Calculator</button>
                </div>
            </div>
        );
    }

    const bmi = calcBMI(data.height, data.weight);
    const [statusText, statusClass] = getBMIStatus(+bmi);
    const tdee = calcTDEE(data);
    const goalCal = getGoalCalories(tdee, data.goal);

    const handleRestart = () => {
        sessionStorage.removeItem('calcData');
        navigate('/calculator');
    };

    return (
        <div className="hc-wrap">

            {/* 1. Haftalık Plan Dashboard */}
            <PlanDashboard data={data} />

            {/* 2. BMI & Özet Kart */}
            <div className="hc-card hc-result" style={{ marginTop: 24 }}>
                <div className="hc-result-circle">
                    <span className="hc-bmi-val">{bmi}</span>
                    <span className="hc-bmi-lbl">BMI</span>
                </div>
                <h2 className="hc-result-title">Hello, {data.name || "Friend"} 👋</h2>
                <span className={`hc-result-status ${statusClass}`}>{statusText}</span>

                <div className="hc-result-cards">
                    {[
                        ["Daily Calories", `${tdee}`, "kcal"],
                        ["Target Calories", `${goalCal}`, "kcal"],
                        ["Goal", goalLabels[data.goal] || "—", ""],
                        ["Height / Weight", `${data.height}cm / ${data.weight}kg`, ""],
                    ].map(([label, value, unit]) => (
                        <div className="hc-rc" key={label}>
                            <div className="hc-rc-label">{label}</div>
                            <div className="hc-rc-value">{value} <span className="hc-rc-unit">{unit}</span></div>
                        </div>
                    ))}
                </div>

                <div className="hc-divider" />

                {/* 3. Bugün ne yedik & Karşılaştırma */}
                <NutritionResult data={data} tdee={tdee} />

                <button className="hc-btn-restart" onClick={handleRestart}>Restart</button>
            </div>

        </div>
    );
}