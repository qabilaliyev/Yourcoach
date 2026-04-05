import { useState } from "react";

function Field({ label, error, children }) {
    return (
        <div className={`hc-field${error ? " hc-field--error" : ""}`}>
            <label>{label}</label>
            {children}
            {error && <span className="hc-field-error">{error}</span>}
        </div>
    );
}

const emptyMeal = () => ({ name: "", kcal: "", protein: "", carb: "", fat: "" });

export default function StepFour({ data, update, errors }) {
    const meals = data.meals_log || [emptyMeal()];

    const setMeals = (newMeals) => update("meals_log", newMeals);

    const updateMeal = (i, key, val) => {
        const updated = meals.map((m, idx) => (idx === i ? { ...m, [key]: val } : m));
        setMeals(updated);
    };

    const addMeal = () => setMeals([...meals, emptyMeal()]);
    const removeMeal = (i) => setMeals(meals.filter((_, idx) => idx !== i));

    return (
        <>
            <div className="hc-step-icon">🍽️</div>
            <h2 className="hc-step-title">What did you eat today?</h2>
            <p className="hc-step-sub">Add your meals. Values can be approximate.</p>

            <div className="hc-meal-list">
                {meals.map((meal, i) => (
                    <div className="hc-meal-card" key={i}>
                        <div className="hc-meal-header">
                            <span className="hc-meal-num">Meal {i + 1}</span>
                            {meals.length > 1 && (
                                <button
                                    type="button"
                                    className="hc-meal-remove"
                                    onClick={() => removeMeal(i)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <Field label="Meal Name (optional)">
                            <input
                                type="text"
                                placeholder="e.g. Chicken breast + rice"
                                value={meal.name}
                                onChange={(e) => updateMeal(i, "name", e.target.value)}
                            />
                        </Field>

                        <div className="hc-field-row hc-field-row--4">
                            <Field label="Calories (kcal)" error={errors[`meal_${i}_kcal`]}>
                                <input
                                    type="number"
                                    placeholder="450"
                                    min="0"
                                    value={meal.kcal}
                                    onChange={(e) => updateMeal(i, "kcal", e.target.value)}
                                />
                            </Field>
                            <Field label="Protein (g)">
                                <input
                                    type="number"
                                    placeholder="30"
                                    min="0"
                                    value={meal.protein}
                                    onChange={(e) => updateMeal(i, "protein", e.target.value)}
                                />
                            </Field>
                            <Field label="Carbs (g)">
                                <input
                                    type="number"
                                    placeholder="55"
                                    min="0"
                                    value={meal.carb}
                                    onChange={(e) => updateMeal(i, "carb", e.target.value)}
                                />
                            </Field>
                            <Field label="Fat (g)">
                                <input
                                    type="number"
                                    placeholder="12"
                                    min="0"
                                    value={meal.fat}
                                    onChange={(e) => updateMeal(i, "fat", e.target.value)}
                                />
                            </Field>
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" className="hc-btn-add-meal" onClick={addMeal}>
                + Add Meal
            </button>

            <Field label="Water Intake (ml)" error={errors.water}>
                <input
                    type="number"
                    placeholder="2000"
                    min="0"
                    value={data.water || ""}
                    onChange={(e) => update("water", e.target.value)}
                />
            </Field>
        </>
    );
}