import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import ProgressBar from "./ProgressBar";
import NutritionResult from "./NutritionResult";
import "../Style/Calculator.css";

const TOTAL_STEPS = 5;

const initialData = {
    name: "", age: "", gender: "",
    height: 170, weight: 70,
    goal: "", activity: "",
    meals: "", diet: "", stress: "",
    exercises: "", exFreq: "", exType: "",
    meals_log: [{ name: "", kcal: "", protein: "", carb: "", fat: "" }],
    water: "",
};

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

function getTips(data) {
    const tips = [];

    if (data.goal === "lose") tips.push("Gradually increase your daily calorie deficit.");
    if (data.goal === "gain") tips.push("Focus on protein-rich foods.");
    if (data.goal === "muscle") tips.push("Combine resistance training with high protein intake.");
    if (data.goal === "maintain") tips.push("Maintain a balanced diet and stay active.");
    if (data.stress === "high") tips.push("High stress can affect weight management — try meditation.");
    if (data.exercises === "no") tips.push("Try walking at least 30 minutes, 3 times a week.");
    if (data.meals === "1-2") tips.push("Increasing meal frequency may help your metabolism.");

    if (tips.length < 3) tips.push("Aim to drink at least 2 liters of water daily.");

    return tips.slice(0, 4);
}

export default function Calculator({ onComplete }) {
    const [started, setStarted] = useState(false);
    const [step, setStep] = useState(1);
    const [data, setData] = useState(initialData);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState({});

    const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

    const validate = (currentData = data) => {
        const e = {};

        if (step === 1) {
            if (!currentData.name.trim()) e.name = "Name is required";
            if (!currentData.age || currentData.age < 10 || currentData.age > 100) e.age = "Enter a valid age";
            if (!currentData.gender) e.gender = "Select gender";
        }

        if (step === 3) {
            if (!currentData.goal) e.goal = "Select a goal";
            if (!currentData.activity) e.activity = "Select activity level";
        }

        if (step === 4) {
            if (!currentData.meals) e.meals = "Select an option";
            if (!currentData.diet) e.diet = "Select an option";
            if (!currentData.stress) e.stress = "Select an option";
        }

        if (step === 5) {
            if (!currentData.exercises) e.exercises = "Select an option";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => {
        if (!validate(data)) return;
        if (step < TOTAL_STEPS) {
            setStep((s) => s + 1);
        } else {
            // Son stepte onComplete callback ile data'yı Main.jsx'e gönder
            if (onComplete) onComplete(data);
        }
    };

    const back = () => {
        setErrors({});
        setStep((s) => s - 1);
    };

    const restart = () => {
        setData(initialData);
        setStep(1);
        setDone(false);
        setErrors({});
        setStarted(false);
    };

    if (!started) {
        return (
            <div className="hc-landing">
                <div className="hc-badge"><span className="hc-dot" />Health Calculator</div>
                <h1 className="hc-landing-title">A healthy life<br /><em>starts here.</em></h1>
                <p className="hc-landing-sub">
                    Calculate your BMI, daily calorie needs, and get personalized recommendations.
                </p>

                <button className="hc-btn-start" onClick={() => setStarted(true)}>
                    Start
                </button>

                <div className="hc-features">
                    {["BMI Calculator", "Calorie Needs", "Nutrition Analysis", "Personal Tips"].map((f) => (
                        <div className="hc-feature-pill" key={f}>{f}</div>
                    ))}
                </div>
            </div>
        );
    }

    if (done) {
        const bmi = calcBMI(data.height, data.weight);
        const [statusText, statusClass] = getBMIStatus(+bmi);
        const tdee = calcTDEE(data);
        const goalCal = getGoalCalories(tdee, data.goal);
        const tips = getTips(data);

        const goalLabels = {
            lose: "Lose Weight",
            gain: "Gain Weight",
            maintain: "Maintain",
            muscle: "Build Muscle"
        };

        return (
            <div className="hc-wrap">
                <div className="hc-card hc-result">
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

                    <div className="hc-tips-title">💡 Personalized Tips</div>
                    <div className="hc-tips-list">
                        {tips.map((t, i) => (
                            <div className="hc-tip" key={i}>{t}</div>
                        ))}
                    </div>

                    <div className="hc-divider" />

                    <NutritionResult data={data} tdee={tdee} />

                    <button className="hc-btn-restart" onClick={restart}>Restart</button>
                </div>
            </div>
        );
    }

    const stepLabels = [
        "Personal Information",
        "Physical Metrics",
        "Goal & Activity",
        "Nutrition & Lifestyle",
        "Exercise Habits",
    ];

    return (
        <div className="calculator">
            <div className="hc-wrap">
                <div className="hc-card">
                    <ProgressBar step={step} total={TOTAL_STEPS} label={stepLabels[step - 1]} />

                    <div className="hc-step-animate" key={step}>
                        {step === 1 && <StepOne step={1} data={data} update={update} errors={errors} />}
                        {step === 2 && <StepOne step={2} data={data} update={update} errors={errors} />}
                        {step === 3 && <StepTwo step={3} data={data} update={update} errors={errors} />}
                        {step === 4 && <StepTwo step={4} data={data} update={update} errors={errors} />}
                        {step === 5 && <StepThree data={data} update={update} errors={errors} />}
                    </div>

                    <div className="hc-nav">
                        {step > 1 && (
                            <button className="hc-btn-back" onClick={back}>
                                Back
                            </button>
                        )}
                        <button className="hc-btn-next" onClick={next}>
                            {step === TOTAL_STEPS ? "Next →" : "Next →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}