import { useState, useEffect, useRef } from "react";
import "../Style/PlanDashboard.css";

// ─── Hesablama funksiyaları ───────────────────────────────────────────────
function calcTDEE(data) {
    const w = +data.weight, h = +data.height, a = +data.age;
    const bmr = data.gender === "female"
        ? 447.6 + 9.2 * w + 3.1 * h - 4.3 * a
        : 88.4 + 13.4 * w + 4.8 * h - 5.7 * a;
    const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 }[data.activity] || 1.375;
    return Math.round(bmr * mult);
}

function getGoalCal(tdee, goal) {
    return { lose: tdee - 500, gain: tdee + 400, maintain: tdee, muscle: tdee + 250 }[goal] || tdee;
}

function getStatus(actual, target) {
    const r = actual / target;
    if (r < 0.85) return { label: "Low", cls: "status-low", diff: Math.round(target - actual), dir: "short" };
    if (r > 1.15) return { label: "High", cls: "status-high", diff: Math.round(actual - target), dir: "over" };
    return { label: "Normal", cls: "status-ok", diff: 0, dir: "" };
}

// ─── Statik həftəlik planlar (AI yükləmə ərzində göstərilir) ─────────────
const weeklyPlans = {
    lose: [
        { day: "Mon", meals: [{ t: "Breakfast", f: "2 boiled eggs + whole wheat toast + tomato", k: 320 }, { t: "Snack", f: "1 apple + 10 almonds", k: 180 }, { t: "Lunch", f: "Grilled chicken (150g) + quinoa + salad", k: 480 }, { t: "Snack", f: "Low-fat yogurt (150g) + walnuts", k: 200 }, { t: "Dinner", f: "Baked salmon (120g) + steamed broccoli + olive oil", k: 420 }] },
        { day: "Tue", meals: [{ t: "Breakfast", f: "Oatmeal (50g) + blueberries + chia seeds", k: 330 }, { t: "Snack", f: "1 banana + 2 tbsp peanut butter", k: 220 }, { t: "Lunch", f: "Lentil soup + whole wheat bread", k: 460 }, { t: "Snack", f: "Carrots + hummus", k: 150 }, { t: "Dinner", f: "Ground turkey (150g) + roasted vegetables", k: 400 }] },
        { day: "Wed", meals: [{ t: "Breakfast", f: "Cheese omelette (2 eggs) + cucumber", k: 280 }, { t: "Snack", f: "Kefir (200ml) + hazelnuts", k: 190 }, { t: "Lunch", f: "Tuna salad (lettuce, tomato, olives, tuna 100g)", k: 380 }, { t: "Snack", f: "Cottage cheese (100g) + honey", k: 160 }, { t: "Dinner", f: "Grilled chicken (150g) + baked sweet potato", k: 450 }] },
        { day: "Thu", meals: [{ t: "Breakfast", f: "Whole grain granola (40g) + milk + strawberries", k: 340 }, { t: "Snack", f: "1 orange + cashews", k: 175 }, { t: "Lunch", f: "Chickpea dish + yogurt + salad", k: 490 }, { t: "Snack", f: "Skimmed milk + 2 crackers", k: 140 }, { t: "Dinner", f: "Baked sea bass (130g) + spinach with olive oil", k: 400 }] },
        { day: "Fri", meals: [{ t: "Breakfast", f: "Protein smoothie: milk + banana + protein powder", k: 310 }, { t: "Snack", f: "Mixed nuts (small handful)", k: 190 }, { t: "Lunch", f: "Whole wheat wrap: chicken + avocado + salad", k: 500 }, { t: "Snack", f: "Apple + low-fat yogurt", k: 160 }, { t: "Dinner", f: "Lean beef (120g) + tomato sauce + whole wheat pasta", k: 480 }] },
        { day: "Sat", meals: [{ t: "Breakfast", f: "Avocado whole wheat toast + boiled egg", k: 370 }, { t: "Snack", f: "Fruit salad + 1 tbsp yogurt", k: 150 }, { t: "Lunch", f: "Lentil patties + tzatziki + salad", k: 430 }, { t: "Snack", f: "Cheese (30g) + apple", k: 170 }, { t: "Dinner", f: "Sardines (100g) + vegetables with olive oil", k: 380 }] },
        { day: "Sun", meals: [{ t: "Breakfast", f: "Whole wheat crepes (2) + yogurt + honey", k: 360 }, { t: "Snack", f: "Kefir + almonds", k: 200 }, { t: "Lunch", f: "Homemade chicken soup + whole grain bread", k: 420 }, { t: "Snack", f: "Cottage cheese + cucumber", k: 120 }, { t: "Dinner", f: "White beans + bulgur pilaf + salad", k: 460 }] },
    ],
    gain: [
        { day: "Mon", meals: [{ t: "Breakfast", f: "3 egg omelette + 2 slices bread + milk", k: 580 }, { t: "Snack", f: "Banana + peanut butter + milk", k: 380 }, { t: "Lunch", f: "Rice pilaf (200g) + grilled chicken (200g) + salad", k: 720 }, { t: "Snack", f: "Protein bar + fruit", k: 320 }, { t: "Dinner", f: "Beef steak (150g) + baked potatoes + broccoli", k: 640 }] },
        { day: "Tue", meals: [{ t: "Breakfast", f: "Protein pancakes (3) + banana + honey", k: 600 }, { t: "Snack", f: "Milk + granola + yogurt", k: 400 }, { t: "Lunch", f: "Pasta (100g dry) + meat sauce", k: 680 }, { t: "Snack", f: "Boiled eggs (2) + whole wheat bread", k: 280 }, { t: "Dinner", f: "Salmon (180g) + bulgur + vegetables", k: 650 }] },
        { day: "Wed", meals: [{ t: "Breakfast", f: "Oatmeal (70g) + milk + fruit + walnuts", k: 550 }, { t: "Snack", f: "Smoothie: milk + banana + oats + protein", k: 420 }, { t: "Lunch", f: "Chicken wraps (2) + yogurt drink", k: 700 }, { t: "Snack", f: "Cottage cheese + honey + bread", k: 300 }, { t: "Dinner", f: "Turkey leg (200g) + boiled potatoes + salad", k: 620 }] },
        { day: "Thu", meals: [{ t: "Breakfast", f: "3 egg scramble + 2 slices bread + milk", k: 570 }, { t: "Snack", f: "Avocado toast + egg", k: 380 }, { t: "Lunch", f: "Chickpea rice (large) + tzatziki", k: 680 }, { t: "Snack", f: "Milk + protein powder + banana", k: 380 }, { t: "Dinner", f: "Grilled fish (200g) + vegetable pasta", k: 630 }] },
        { day: "Fri", meals: [{ t: "Breakfast", f: "Muesli (70g) + banana + strawberries", k: 520 }, { t: "Snack", f: "Mixed nuts + cheese", k: 350 }, { t: "Lunch", f: "Rice + chicken stir-fry (large portion)", k: 720 }, { t: "Snack", f: "Milk + crackers + fruit", k: 290 }, { t: "Dinner", f: "Lamb chops (150g) + bulgur + salad", k: 660 }] },
        { day: "Sat", meals: [{ t: "Breakfast", f: "Sunny side up eggs (3) + tomato + bread + milk", k: 580 }, { t: "Snack", f: "Protein smoothie + banana", k: 380 }, { t: "Lunch", f: "Wraps (2) + yogurt drink + salad", k: 700 }, { t: "Snack", f: "Granola bar + milk", k: 320 }, { t: "Dinner", f: "Ground beef (150g) + pasta + cheese", k: 660 }] },
        { day: "Sun", meals: [{ t: "Breakfast", f: "Full spread: cheese, eggs, honey, olives, bread + milk", k: 600 }, { t: "Snack", f: "Milk + walnuts + dried apricots", k: 320 }, { t: "Lunch", f: "Meat chickpea stew (large) + rice + salad", k: 720 }, { t: "Snack", f: "Yogurt + fruit + granola", k: 280 }, { t: "Dinner", f: "Chicken stir-fry (200g) + roasted vegetables + bread", k: 620 }] },
    ],
    muscle: [
        { day: "Mon", meals: [{ t: "Breakfast", f: "4 egg omelette + oats (60g) + banana", k: 620 }, { t: "Snack", f: "Yogurt + granola + fruit", k: 350 }, { t: "Lunch", f: "Grilled chicken (200g) + rice (200g) + salad", k: 720 }, { t: "Post-workout", f: "Protein shake + banana", k: 300 }, { t: "Dinner", f: "Salmon (150g) + sweet potato + broccoli", k: 540 }] },
        { day: "Tue", meals: [{ t: "Breakfast", f: "Protein pancakes (3) + blueberries + honey", k: 590 }, { t: "Snack", f: "Cottage cheese + walnuts + apple", k: 280 }, { t: "Lunch", f: "Turkey (200g) + bulgur (180g) + vegetables", k: 700 }, { t: "Snack", f: "Boiled eggs (2) + whole wheat bread", k: 280 }, { t: "Dinner", f: "Beef steak (150g) + roasted vegetables + salad", k: 560 }] },
        { day: "Wed", meals: [{ t: "Breakfast", f: "Oatmeal (70g) + milk + 2 eggs + fruit", k: 580 }, { t: "Snack", f: "Protein smoothie (milk + protein + banana)", k: 380 }, { t: "Lunch", f: "Tuna wraps (2) + vegetables", k: 650 }, { t: "Snack", f: "Yogurt + almonds", k: 220 }, { t: "Dinner", f: "Chicken (180g) + pasta (80g) + cheese", k: 640 }] },
        { day: "Thu", meals: [{ t: "Breakfast", f: "3 egg scramble + bread + milk", k: 560 }, { t: "Snack", f: "Banana + peanut butter + milk", k: 350 }, { t: "Lunch", f: "Chickpea salad (large) + chicken (150g) + rice", k: 720 }, { t: "Post-workout", f: "Protein shake + banana or bread", k: 320 }, { t: "Dinner", f: "Sea bass (150g) + quinoa + vegetables", k: 520 }] },
        { day: "Fri", meals: [{ t: "Breakfast", f: "Avocado toast (2) + 2 boiled eggs + milk", k: 570 }, { t: "Snack", f: "Yogurt + granola + strawberries", k: 300 }, { t: "Lunch", f: "Rice (200g) + chicken stir-fry (200g)", k: 700 }, { t: "Snack", f: "Cottage cheese + apple", k: 200 }, { t: "Dinner", f: "Lamb chops (150g) + bulgur + salad", k: 580 }] },
        { day: "Sat", meals: [{ t: "Breakfast", f: "Protein waffles (2) + banana + honey", k: 560 }, { t: "Snack", f: "Milk + granola + walnuts", k: 360 }, { t: "Lunch", f: "Ground beef (150g) + pasta + tomato sauce", k: 680 }, { t: "Snack", f: "Protein bar", k: 250 }, { t: "Dinner", f: "Chicken (200g) + potatoes (150g) + broccoli", k: 620 }] },
        { day: "Sun", meals: [{ t: "Breakfast", f: "Full spread: eggs, cheese, olives, tomato, bread + milk", k: 580 }, { t: "Snack", f: "Fruit salad + yogurt", k: 200 }, { t: "Lunch", f: "Lentil soup + whole bread + yogurt", k: 450 }, { t: "Snack", f: "Protein smoothie", k: 300 }, { t: "Dinner", f: "Salmon (180g) + rice (180g) + salad", k: 660 }] },
    ],
    maintain: [
        { day: "Mon", meals: [{ t: "Breakfast", f: "2 eggs + oats (50g) + fruit", k: 430 }, { t: "Snack", f: "Yogurt + hazelnuts", k: 200 }, { t: "Lunch", f: "Chicken (150g) + bulgur (150g) + salad", k: 560 }, { t: "Snack", f: "Fruit + cottage cheese", k: 180 }, { t: "Dinner", f: "Fish (130g) + vegetables + whole wheat bread", k: 450 }] },
        { day: "Tue", meals: [{ t: "Breakfast", f: "Whole wheat toast + avocado + boiled egg", k: 420 }, { t: "Snack", f: "Apple + almonds", k: 185 }, { t: "Lunch", f: "Lentil soup + whole bread + tzatziki", k: 490 }, { t: "Snack", f: "Kefir + dried fruit", k: 180 }, { t: "Dinner", f: "Turkey (150g) + roasted vegetables", k: 430 }] },
        { day: "Wed", meals: [{ t: "Breakfast", f: "Yogurt + granola + fruit", k: 380 }, { t: "Snack", f: "Walnuts + cheese", k: 190 }, { t: "Lunch", f: "Tuna salad + whole bread", k: 480 }, { t: "Snack", f: "Milk + banana", k: 200 }, { t: "Dinner", f: "Chicken stir-fry + rice (150g) + salad", k: 510 }] },
        { day: "Thu", meals: [{ t: "Breakfast", f: "2 egg omelette + vegetables + bread", k: 390 }, { t: "Snack", f: "Apple + hazelnuts", k: 175 }, { t: "Lunch", f: "Chickpea dish + yogurt + salad", k: 520 }, { t: "Snack", f: "Light protein smoothie", k: 220 }, { t: "Dinner", f: "Salmon (130g) + steamed vegetables", k: 440 }] },
        { day: "Fri", meals: [{ t: "Breakfast", f: "Muesli + milk + fruit", k: 410 }, { t: "Snack", f: "Yogurt + honey", k: 160 }, { t: "Lunch", f: "Wrap: chicken + salad + yogurt sauce", k: 530 }, { t: "Snack", f: "Fruit + cottage cheese", k: 150 }, { t: "Dinner", f: "Fish (130g) + potatoes (100g) + salad", k: 480 }] },
        { day: "Sat", meals: [{ t: "Breakfast", f: "Avocado toast + egg + milk", k: 430 }, { t: "Snack", f: "Kefir + granola", k: 220 }, { t: "Lunch", f: "Homemade meatballs (3) + bulgur + tzatziki", k: 560 }, { t: "Snack", f: "Fruit salad", k: 130 }, { t: "Dinner", f: "Turkey (130g) + pasta (70g) + salad", k: 490 }] },
        { day: "Sun", meals: [{ t: "Breakfast", f: "Weekend brunch (light portion)", k: 480 }, { t: "Snack", f: "Yogurt + fruit", k: 160 }, { t: "Lunch", f: "Lentil patties + yogurt drink + salad", k: 430 }, { t: "Snack", f: "Cheese + whole bread", k: 180 }, { t: "Dinner", f: "Fish soup + whole bread", k: 400 }] },
    ],
};

const exercisePlans = {
    lose: [
        { icon: "🚶", title: "Daily Walking", desc: "Brisk 30–45 min walk. Burns ~200–300 kcal, improves insulin sensitivity." },
        { icon: "🚴", title: "Cardio 3x/week", desc: "Cycling, swimming or elliptical 30 min. Accelerates fat burning, low joint impact." },
        { icon: "🏋️", title: "Weights 2x/week", desc: "Resistance training is essential to preserve muscle mass while losing fat." },
        { icon: "🧘", title: "Active Recovery", desc: "Stress raises cortisol and makes weight loss harder. Add light yoga or breathing exercises." },
    ],
    gain: [
        { icon: "🏋️", title: "Compound Movements 4x/week", desc: "Squats, deadlifts, bench press are the most effective for muscle growth." },
        { icon: "😴", title: "Rest & Sleep", desc: "Muscles grow during rest, not training. Aim for 7–9 hours of sleep." },
        { icon: "🥛", title: "Post-workout Nutrition", desc: "Consume protein + carbs within 30–60 min after exercise." },
        { icon: "📈", title: "Progressive Overload", desc: "Increase weight or reps each week. Muscles need new stimuli to grow." },
    ],
    muscle: [
        { icon: "💪", title: "Progressive Overload", desc: "Increase weight or reps weekly. Continuous new stimulus is needed for muscle growth." },
        { icon: "🏋️", title: "Split Training 4–5x/week", desc: "Push/pull/legs or upper/lower split is ideal for balance and intensity." },
        { icon: "🧘", title: "Mobility Work", desc: "10 min stretching after each workout. Reduces injury risk." },
        { icon: "🥩", title: "High Protein Intake", desc: "1.8–2.2g protein per kg bodyweight. Pay special attention on training days." },
    ],
    maintain: [
        { icon: "🚴", title: "Mixed Cardio 2x/week", desc: "2x cardio + 2x strength per week maintains overall health and energy." },
        { icon: "🧘", title: "Flexibility Work", desc: "Yoga or stretching 2–3x/week. Improves posture, reduces tension." },
        { icon: "🚶", title: "Active Lifestyle", desc: "Take stairs, walk short distances. Aim for 8,000+ steps daily." },
        { icon: "⚖️", title: "Balance", desc: "Keep cardio and strength balanced. Only one can lead to muscle or fitness loss." },
    ],
};

// ─── AI Plan Generator ───────────────────────────────────────────────────
async function generateAIPlan(data, targets, goalCal, tdee) {
    const goalLabels = { lose: "Weight Loss", gain: "Weight Gain", muscle: "Build Muscle", maintain: "Maintenance" };
    const bmi = (data.weight / ((data.height / 100) ** 2)).toFixed(1);

    const prompt = `You are a professional fitness coach and nutritionist. Generate a FULLY PERSONALIZED health plan for this user.

USER PROFILE:
- Name: ${data.name || "User"}
- Age: ${data.age}, Gender: ${data.gender}
- Height: ${data.height}cm, Weight: ${data.weight}kg
- BMI: ${bmi}
- Goal: ${goalLabels[data.goal] || data.goal}
- Activity Level: ${data.activity}
- Diet Type: ${data.diet || "regular"}
- Meals per day: ${data.meals || "3"}
- Stress level: ${data.stress || "medium"}
- Exercises: ${data.exercises || "no"} ${data.exFreq ? `(${data.exFreq}/week, ${data.exType})` : ""}

CALCULATED METRICS:
- TDEE: ${tdee} kcal/day
- Daily Target: ${Math.round(goalCal)} kcal
- Protein target: ${targets.protein}g | Carbs: ${targets.carb}g | Fat: ${targets.fat}g | Water: ${targets.water}ml

Respond ONLY with a valid JSON object (no markdown, no backticks). Use this exact structure:

{
  "summary": "2-3 sentence personalized assessment for ${data.name || "this user"} based on their profile",
  "bmi_analysis": "1-2 sentences explaining their BMI of ${bmi} and what it means for their goal",
  "daily_routine": [
    {"time": "6:30 AM", "activity": "description"},
    {"time": "7:00 AM", "activity": "description"},
    {"time": "10:00 AM", "activity": "description"},
    {"time": "12:30 PM", "activity": "description"},
    {"time": "3:00 PM", "activity": "description"},
    {"time": "6:00 PM", "activity": "description"},
    {"time": "8:00 PM", "activity": "description"},
    {"time": "10:00 PM", "activity": "description"}
  ],
  "smart_tips": [
    "Personalized tip 1 based on their specific profile",
    "Personalized tip 2",
    "Personalized tip 3",
    "Personalized tip 4",
    "Personalized tip 5"
  ],
  "foods_to_eat": ["food1", "food2", "food3", "food4", "food5", "food6", "food7", "food8"],
  "foods_to_avoid": ["food1", "food2", "food3", "food4", "food5", "food6"],
  "motivation": "A powerful, personalized motivation message for ${data.name || "this user"} based on their goal of ${goalLabels[data.goal] || data.goal}",
  "weekly_meals": [
    {
      "day": "Monday",
      "meals": [
        {"type": "Breakfast", "name": "meal name", "portions": "exact portions", "kcal": 400, "protein": 25, "carbs": 45, "fat": 12, "budget_alt": "cheap alternative"},
        {"type": "Snack 1", "name": "meal name", "portions": "exact portions", "kcal": 180, "protein": 8, "carbs": 20, "fat": 7, "budget_alt": "cheap alternative"},
        {"type": "Lunch", "name": "meal name", "portions": "exact portions", "kcal": 550, "protein": 40, "carbs": 55, "fat": 14, "budget_alt": "cheap alternative"},
        {"type": "Snack 2", "name": "meal name", "portions": "exact portions", "kcal": 150, "protein": 6, "carbs": 18, "fat": 5, "budget_alt": "cheap alternative"},
        {"type": "Dinner", "name": "meal name", "portions": "exact portions", "kcal": 500, "protein": 38, "carbs": 42, "fat": 16, "budget_alt": "cheap alternative"}
      ]
    },
    {"day": "Tuesday", "meals": [...]},
    {"day": "Wednesday", "meals": [...]},
    {"day": "Thursday", "meals": [...]},
    {"day": "Friday", "meals": [...]},
    {"day": "Saturday", "meals": [...]},
    {"day": "Sunday", "meals": [...]}
  ],
  "workout_week": [
    {"day": "Monday", "focus": "focus area", "type": "workout or rest", "gym": "gym exercises with sets/reps", "home": "home exercises with sets/reps", "duration": "45 min", "calories_burned": 300},
    {"day": "Tuesday", ...},
    {"day": "Wednesday", ...},
    {"day": "Thursday", ...},
    {"day": "Friday", ...},
    {"day": "Saturday", ...},
    {"day": "Sunday", "focus": "Rest & Recovery", "type": "rest", "gym": "Complete rest or light yoga", "home": "Complete rest or gentle stretching", "duration": "—", "calories_burned": 0}
  ],
  "hydration_schedule": [
    {"time": "Wake up", "amount": "300ml", "tip": "tip"},
    {"time": "Pre-breakfast", "amount": "200ml", "tip": "tip"},
    {"time": "Mid-morning", "amount": "300ml", "tip": "tip"},
    {"time": "Pre-lunch", "amount": "200ml", "tip": "tip"},
    {"time": "Afternoon", "amount": "400ml", "tip": "tip"},
    {"time": "Pre-workout", "amount": "300ml", "tip": "tip"},
    {"time": "Post-workout", "amount": "400ml", "tip": "tip"},
    {"time": "Evening", "amount": "300ml", "tip": "tip"},
    {"time": "Pre-bed", "amount": "150ml", "tip": "tip"}
  ]
}

IMPORTANT:
- Adapt ALL meals to diet type: ${data.diet || "regular"} (if vegan: no animal products; if vegetarian: no meat but eggs/dairy ok)
- Make meals realistic for daily cooking, not exotic
- Calories across all meals should total approximately ${Math.round(goalCal)} kcal/day
- Be EXTREMELY specific and personalized — no generic answers
- Include budget alternatives for every meal`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
        }),
    });

    const result = await response.json();
    const text = result.content?.map(b => b.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
}

// ─── Sub-components ──────────────────────────────────────────────────────
function StatusBadge({ actual, target }) {
    const st = getStatus(actual, target);
    return <span className={`pd-badge pd-badge--${st.cls.replace("status-", "")}`}>{st.label}</span>;
}

function NutrientBar({ label, actual, target, unit, color }) {
    const pct = Math.min(Math.round((actual / target) * 100), 100);
    return (
        <div className="pd-bar-row">
            <span className="pd-bar-label">{label}</span>
            <div className="pd-bar-track">
                <div className="pd-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="pd-bar-vals">{actual} / {target} {unit}</span>
            <StatusBadge actual={actual} target={target} />
        </div>
    );
}

// ─── AI Plan Tab ─────────────────────────────────────────────────────────
function AIOverviewTab({ aiPlan, data, targets, goalCal, tdee, loading, error, onGenerate }) {
    const bmi = (data.weight / ((data.height / 100) ** 2)).toFixed(1);
    const bmiStatus = bmi < 18.5 ? { label: "Underweight", color: "#378ADD" }
        : bmi < 25 ? { label: "Normal weight", color: "#1D9E75" }
            : bmi < 30 ? { label: "Overweight", color: "#BA7517" }
                : { label: "Obese", color: "#D4537E" };

    const goalLabels = { lose: "Weight Loss", gain: "Weight Gain", muscle: "Build Muscle", maintain: "Maintenance" };

    return (
        <div className="pd-ai-overview">
            {/* Metrics row */}
            <div className="pd-metrics-row">
                {[
                    { v: bmi, l: "BMI", u: "", color: bmiStatus.color, sub: bmiStatus.label },
                    { v: tdee, l: "TDEE", u: "kcal", color: "#378ADD", sub: "daily burn" },
                    { v: Math.round(goalCal), l: "Target", u: "kcal", color: "#1D9E75", sub: goalLabels[data.goal] },
                    { v: targets.protein, l: "Protein", u: "g", color: "#D4537E", sub: "daily goal" },
                    { v: targets.water, l: "Water", u: "ml", color: "#7F77DD", sub: "daily goal" },
                ].map(({ v, l, u, color, sub }) => (
                    <div className="pd-metric-card" key={l}>
                        <div className="pd-metric-val" style={{ color }}>{v}<span className="pd-metric-unit"> {u}</span></div>
                        <div className="pd-metric-lbl">{l}</div>
                        <div className="pd-metric-sub">{sub}</div>
                    </div>
                ))}
            </div>

            {/* AI Plan Box */}
            {!aiPlan && !loading && (
                <div className="pd-ai-prompt-box">
                    <div className="pd-ai-icon">✨</div>
                    <h3 className="pd-ai-prompt-title">Get Your AI-Powered Plan</h3>
                    <p className="pd-ai-prompt-desc">
                        Generate a fully personalized plan with detailed meal recommendations, workout schedule,
                        hydration guide, and smart tips — tailored specifically for <strong>{data.name || "you"}</strong>.
                    </p>
                    <button className="pd-ai-generate-btn" onClick={onGenerate}>
                        <span>✨</span> Generate My Personal Plan
                    </button>
                </div>
            )}

            {loading && (
                <div className="pd-ai-loading">
                    <div className="pd-ai-spinner" />
                    <p className="pd-ai-loading-text">Creating your personalized plan…</p>
                    <p className="pd-ai-loading-sub">Analyzing your profile and calculating optimal recommendations</p>
                </div>
            )}

            {error && (
                <div className="pd-ai-error">
                    <div className="pd-ai-error-icon">⚠️</div>
                    <p>{error}</p>
                    <button className="pd-ai-retry-btn" onClick={onGenerate}>Try Again</button>
                </div>
            )}

            {aiPlan && (
                <div className="pd-ai-results">
                    {/* Summary */}
                    <div className="pd-card pd-card--highlight">
                        <div className="pd-card-badge">✨ AI Analysis</div>
                        <p className="pd-ai-summary">{aiPlan.summary}</p>
                        <p className="pd-ai-bmi-analysis">{aiPlan.bmi_analysis}</p>
                    </div>

                    {/* Motivation */}
                    <div className="pd-card pd-card--motivation">
                        <div className="pd-mot-icon">🎯</div>
                        <p className="pd-motivation-text">"{aiPlan.motivation}"</p>
                    </div>

                    {/* Foods */}
                    <div className="pd-card">
                        <h3 className="pd-card-title">Foods Guide</h3>
                        <div className="pd-foods-grid">
                            <div className="pd-foods-col">
                                <div className="pd-foods-header pd-foods-header--eat">✅ Eat These</div>
                                {(aiPlan.foods_to_eat || []).map((f, i) => (
                                    <div className="pd-food-item pd-food-item--eat" key={i}>{f}</div>
                                ))}
                            </div>
                            <div className="pd-foods-col">
                                <div className="pd-foods-header pd-foods-header--avoid">❌ Avoid These</div>
                                {(aiPlan.foods_to_avoid || []).map((f, i) => (
                                    <div className="pd-food-item pd-food-item--avoid" key={i}>{f}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Smart Tips */}
                    <div className="pd-card">
                        <h3 className="pd-card-title">Smart Tips For You</h3>
                        <div className="pd-tips-list">
                            {(aiPlan.smart_tips || []).map((tip, i) => (
                                <div className="pd-tip-item" key={i}>
                                    <span className="pd-tip-num">{i + 1}</span>
                                    <span className="pd-tip-text">{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Daily Routine */}
                    <div className="pd-card">
                        <h3 className="pd-card-title">Your Ideal Daily Routine</h3>
                        <div className="pd-routine-list">
                            {(aiPlan.daily_routine || []).map((r, i) => (
                                <div className="pd-routine-row" key={i}>
                                    <span className="pd-routine-time">{r.time}</span>
                                    <span className="pd-routine-activity">{r.activity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Meals Tab ────────────────────────────────────────────────────────────
function MealsTab({ aiPlan, data }) {
    const [activeDay, setActiveDay] = useState(0);
    const plan = aiPlan?.weekly_meals || null;
    const staticPlan = weeklyPlans[data.goal] || weeklyPlans.maintain;

    if (!plan) {
        // fallback to static plan
        const dayData = staticPlan[activeDay];
        const dayTotal = dayData.meals.reduce((a, m) => a + m.k, 0);
        return (
            <div className="pd-meals-tab">
                <div className="pd-card">
                    <h3 className="pd-card-title">Weekly Meal Plan</h3>
                    <p className="pd-ai-hint">Generate your AI plan for a fully personalized meal schedule with budget alternatives.</p>
                    <div className="pd-day-tabs">
                        {staticPlan.map((d, i) => (
                            <button key={i} className={`pd-day-btn${activeDay === i ? " pd-day-btn--active" : ""}`} onClick={() => setActiveDay(i)}>{d.day}</button>
                        ))}
                    </div>
                    <div className="pd-meal-list">
                        {dayData.meals.map((m, i) => (
                            <div className="pd-meal-row" key={i}>
                                <span className="pd-meal-label">{m.t}</span>
                                <span className="pd-meal-food">{m.f}</span>
                                <span className="pd-meal-kcal">{m.k} kcal</span>
                            </div>
                        ))}
                        <div className="pd-meal-total"><span>Daily Total</span><span>{dayTotal} kcal</span></div>
                    </div>
                </div>
            </div>
        );
    }

    const dayData = plan[activeDay];
    const dayTotal = (dayData?.meals || []).reduce((a, m) => a + (m.kcal || 0), 0);

    return (
        <div className="pd-meals-tab">
            <div className="pd-card">
                <div className="pd-card-badge">✨ AI Personalized</div>
                <h3 className="pd-card-title">7-Day Meal Plan</h3>
                <div className="pd-day-tabs">
                    {plan.map((d, i) => (
                        <button key={i} className={`pd-day-btn${activeDay === i ? " pd-day-btn--active" : ""}`} onClick={() => setActiveDay(i)}>
                            {d.day?.slice(0, 3)}
                        </button>
                    ))}
                </div>
                <div className="pd-ai-meal-list">
                    {(dayData?.meals || []).map((m, i) => (
                        <div className="pd-ai-meal-card" key={i}>
                            <div className="pd-ai-meal-type">{m.type}</div>
                            <div className="pd-ai-meal-name">{m.name}</div>
                            <div className="pd-ai-meal-portions">{m.portions}</div>
                            <div className="pd-ai-meal-macros">
                                <span className="pd-macro-pill pd-macro-kcal">{m.kcal} kcal</span>
                                <span className="pd-macro-pill pd-macro-p">P: {m.protein}g</span>
                                <span className="pd-macro-pill pd-macro-c">C: {m.carbs}g</span>
                                <span className="pd-macro-pill pd-macro-f">F: {m.fat}g</span>
                            </div>
                            {m.budget_alt && (
                                <div className="pd-budget-alt">
                                    <span className="pd-budget-icon">💰</span>
                                    <span>{m.budget_alt}</span>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="pd-meal-total"><span>Day Total</span><span>{dayTotal} kcal</span></div>
                </div>
            </div>
        </div>
    );
}

// ─── Workout Tab ─────────────────────────────────────────────────────────
function WorkoutTab({ aiPlan, data }) {
    const [activeDay, setActiveDay] = useState(0);

    if (!aiPlan?.workout_week) {
        const exList = exercisePlans[data.goal] || exercisePlans.maintain;
        return (
            <div className="pd-card">
                <h3 className="pd-card-title">Exercise Recommendations</h3>
                <p className="pd-ai-hint">Generate your AI plan for a detailed weekly workout schedule with gym & home options.</p>
                {data.exercises === "no" && (
                    <div className="pd-warn-box">You're currently not exercising. Starting with just 3x 15-minute walks per week makes a huge difference!</div>
                )}
                <div className="pd-ex-list">
                    {exList.map((ex, i) => (
                        <div className="pd-ex-card" key={i}>
                            <div className="pd-ex-icon">{ex.icon}</div>
                            <div><div className="pd-ex-title">{ex.title}</div><div className="pd-ex-desc">{ex.desc}</div></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const week = aiPlan.workout_week;
    const dayData = week[activeDay];

    return (
        <div className="pd-workout-tab">
            <div className="pd-card">
                <div className="pd-card-badge">✨ AI Personalized</div>
                <h3 className="pd-card-title">Weekly Training Program</h3>
                <div className="pd-day-tabs">
                    {week.map((d, i) => (
                        <button key={i} className={`pd-day-btn${activeDay === i ? " pd-day-btn--active" : ""} ${d.type === "rest" ? "pd-day-btn--rest" : ""}`} onClick={() => setActiveDay(i)}>
                            {d.day?.slice(0, 3)}
                        </button>
                    ))}
                </div>
                {dayData && (
                    <div className="pd-workout-detail">
                        <div className="pd-workout-header">
                            <div>
                                <div className="pd-workout-focus">{dayData.focus}</div>
                                <div className="pd-workout-meta">
                                    <span>⏱ {dayData.duration}</span>
                                    {dayData.calories_burned > 0 && <span>🔥 ~{dayData.calories_burned} kcal</span>}
                                </div>
                            </div>
                            <span className={`pd-workout-type-badge ${dayData.type === "rest" ? "pd-badge--ok" : "pd-badge--low"}`}>
                                {dayData.type === "rest" ? "Rest Day" : "Training"}
                            </span>
                        </div>
                        <div className="pd-workout-options">
                            <div className="pd-workout-option">
                                <div className="pd-workout-option-label">🏋️ Gym</div>
                                <div className="pd-workout-option-text">{dayData.gym}</div>
                            </div>
                            <div className="pd-workout-option">
                                <div className="pd-workout-option-label">🏠 Home</div>
                                <div className="pd-workout-option-text">{dayData.home}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Hydration Tab ────────────────────────────────────────────────────────
function HydrationTab({ aiPlan, targets }) {
    const schedule = aiPlan?.hydration_schedule || [
        { time: "Wake up", amount: "300ml", tip: "Rehydrate after sleep" },
        { time: "Pre-breakfast", amount: "200ml", tip: "Primes digestion" },
        { time: "Mid-morning", amount: "300ml", tip: "Stay energized" },
        { time: "Pre-lunch", amount: "200ml", tip: "Controls appetite" },
        { time: "Afternoon", amount: "400ml", tip: "Avoid energy dip" },
        { time: "Pre-workout", amount: "300ml", tip: "Pre-hydration" },
        { time: "Post-workout", amount: "400ml", tip: "Replenish fluids" },
        { time: "Evening", amount: "300ml", tip: "Final push" },
        { time: "Pre-bed", amount: "150ml", tip: "Not too much" },
    ];

    return (
        <div className="pd-card">
            {aiPlan && <div className="pd-card-badge">✨ AI Personalized</div>}
            <h3 className="pd-card-title">Daily Hydration Schedule</h3>
            <div className="pd-hydration-target">
                <span className="pd-hydration-val">{targets.water} ml</span>
                <span className="pd-hydration-lbl">Daily Target · {Math.round(targets.water / 250)} glasses</span>
            </div>
            <div className="pd-hydration-list">
                {schedule.map((s, i) => (
                    <div className="pd-hydration-row" key={i}>
                        <span className="pd-hydration-time">{s.time}</span>
                        <span className="pd-hydration-tip">{s.tip}</span>
                        <span className="pd-hydration-amount">{s.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Today's Log Tab ──────────────────────────────────────────────────────
function TodayTab({ data, totals, water, targets }) {
    const bars = [
        { label: "Calories", actual: Math.round(totals.kcal), target: targets.kcal, unit: "kcal", color: "#378ADD" },
        { label: "Protein", actual: Math.round(totals.protein), target: targets.protein, unit: "g", color: "#1D9E75" },
        { label: "Carbs", actual: Math.round(totals.carb), target: targets.carb, unit: "g", color: "#BA7517" },
        { label: "Fat", actual: Math.round(totals.fat), target: targets.fat, unit: "g", color: "#D4537E" },
        { label: "Water", actual: Math.round(water), target: targets.water, unit: "ml", color: "#7F77DD" },
    ];
    const hasMeals = (data.meals_log || []).some(m => m.kcal);

    return (
        <>
            <div className="pd-card">
                <h3 className="pd-card-title">Today's Intake</h3>
                <div className="pd-bars">{bars.map(b => <NutrientBar key={b.label} {...b} />)}</div>
            </div>
            <div className="pd-card">
                <h3 className="pd-card-title">Logged Meals</h3>
                {!hasMeals ? (
                    <p className="pd-empty">No meals logged yet for today.</p>
                ) : (
                    <div className="pd-meal-list">
                        {(data.meals_log || []).map((m, i) =>
                            m.kcal ? (
                                <div className="pd-meal-row" key={i}>
                                    <span className="pd-meal-label">{m.name || `Meal ${i + 1}`}</span>
                                    <span className="pd-meal-food">{m.kcal} kcal | P:{m.protein || 0}g C:{m.carb || 0}g F:{m.fat || 0}g</span>
                                </div>
                            ) : null
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function PlanDashboard({ data: propData }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [aiPlan, setAiPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const data = propData || (() => {
        try { return JSON.parse(sessionStorage.getItem("calcData") || "null"); } catch { return null; }
    })();

    // Load cached AI plan
    useEffect(() => {
        try {
            const cached = sessionStorage.getItem("aiPlan");
            if (cached) setAiPlan(JSON.parse(cached));
        } catch { }
    }, []);

    if (!data) {
        return (
            <div className="pd-empty-state">
                <p>No data found. Please complete the calculator first.</p>
            </div>
        );
    }

    const tdee = calcTDEE(data);
    const goalCal = getGoalCal(tdee, data.goal);
    const targets = {
        kcal: goalCal,
        protein: Math.round((goalCal * 0.30) / 4),
        carb: Math.round((goalCal * 0.40) / 4),
        fat: Math.round((goalCal * 0.30) / 9),
        water: Math.round((+data.weight) * 35),
    };

    const totals = (data.meals_log || []).reduce(
        (a, m) => ({ kcal: a.kcal + (parseFloat(m.kcal) || 0), protein: a.protein + (parseFloat(m.protein) || 0), carb: a.carb + (parseFloat(m.carb) || 0), fat: a.fat + (parseFloat(m.fat) || 0) }),
        { kcal: 0, protein: 0, carb: 0, fat: 0 }
    );
    const water = parseFloat(data.water) || 0;

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const plan = await generateAIPlan(data, targets, goalCal, tdee);
            setAiPlan(plan);
            sessionStorage.setItem("aiPlan", JSON.stringify(plan));
        } catch (e) {
            setError("Could not generate the plan. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: "✨" },
        { id: "meals", label: "Meals", icon: "🍽️" },
        { id: "workout", label: "Workout", icon: "🏋️" },
        { id: "hydration", label: "Hydration", icon: "💧" },
        { id: "today", label: "Today", icon: "📊" },
    ];

    return (
        <div className="pd-wrap">
            <div className="pd-tabs">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        className={`pd-tab${activeTab === t.id ? " pd-tab--active" : ""}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        <span className="pd-tab-icon">{t.icon}</span>
                        <span className="pd-tab-label">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="pd-tab-content">
                {activeTab === "overview" && (
                    <AIOverviewTab
                        aiPlan={aiPlan}
                        data={data}
                        targets={targets}
                        goalCal={goalCal}
                        tdee={tdee}
                        loading={loading}
                        error={error}
                        onGenerate={handleGenerate}
                    />
                )}
                {activeTab === "meals" && <MealsTab aiPlan={aiPlan} data={data} />}
                {activeTab === "workout" && <WorkoutTab aiPlan={aiPlan} data={data} />}
                {activeTab === "hydration" && <HydrationTab aiPlan={aiPlan} targets={targets} />}
                {activeTab === "today" && <TodayTab data={data} totals={totals} water={water} targets={targets} />}
            </div>
        </div>
    );
}