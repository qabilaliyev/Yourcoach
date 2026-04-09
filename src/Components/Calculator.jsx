import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import ProgressBar from "./ProgressBar";
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

function loadData() {
    try {
        const saved = sessionStorage.getItem("calcDataTemp");
        return saved ? JSON.parse(saved) : initialData;
    } catch {
        return initialData;
    }
}

function loadErrors() {
    try {
        const saved = sessionStorage.getItem("calcErrors");
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
}

export default function Calculator({ onComplete }) {
    const [step, setStep] = useState(() => {
        try {
            const saved = sessionStorage.getItem("calcStep");
            return saved ? parseInt(saved) : 1;
        } catch { return 1; }
    });
    const [, forceUpdate] = useState(0);

    const data = loadData();
    const errors = loadErrors();

    const goToStep = (newStep) => {
        sessionStorage.setItem("calcStep", String(newStep));
        setStep(newStep);
    };

    const update = (key, value) => {
        const current = loadData();
        const updated = { ...current, [key]: value };
        sessionStorage.setItem("calcDataTemp", JSON.stringify(updated));
        forceUpdate(n => n + 1);
    };

    const setErrors = (e) => {
        sessionStorage.setItem("calcErrors", JSON.stringify(e));
        forceUpdate(n => n + 1);
    };

    const validate = () => {
        const e = {};
        if (step === 1) {
            if (!data.name?.trim()) e.name = "Name is required";
            if (!data.age || data.age < 10 || data.age > 100) e.age = "Enter a valid age";
            if (!data.gender) e.gender = "Select gender";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => {
        if (!validate()) return;
        if (step < TOTAL_STEPS) {
            sessionStorage.setItem("calcErrors", JSON.stringify({}));
            goToStep(step + 1);
        } else {
            sessionStorage.removeItem("calcErrors");
            sessionStorage.removeItem("calcStep");
            onComplete?.(data);
        }
    };

    const back = () => {
        sessionStorage.setItem("calcErrors", JSON.stringify({}));
        goToStep(Math.max(1, step - 1));
    };

    const stepLabels = [
        "Personal Information",
        "Physical Metrics",
        "Goal & Activity",
        "Nutrition & Lifestyle",
        "Exercise Habits",
    ];

    return (
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
                {step > 1 && <button className="hc-btn-back" onClick={back}>Back</button>}
                <button className="hc-btn-next" onClick={next}>
                    {step === TOTAL_STEPS ? "Finish →" : "Next →"}
                </button>
            </div>
        </div>
    );
}