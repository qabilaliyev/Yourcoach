import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Style/MealsPage.css'

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

const weeklyPlans = {
    lose: [
        {
            day: "Mon", meals: [
                { t: "Breakfast", f: "2 boiled eggs + 1 slice whole wheat bread + tomato", k: 320 },
                { t: "Snack", f: "1 apple + 10 almonds", k: 180 },
                { t: "Lunch", f: "Grilled chicken (150g) + quinoa (1/2 cup) + salad", k: 480 },
                { t: "Snack", f: "Low-fat yogurt (150g) + handful of walnuts", k: 200 },
                { t: "Dinner", f: "Baked salmon (120g) + steamed broccoli + olive oil", k: 420 },
            ]
        },
        {
            day: "Tue", meals: [
                { t: "Breakfast", f: "Oatmeal (50g) + blueberries + 1 tbsp chia seeds", k: 330 },
                { t: "Snack", f: "1 banana + 2 tbsp peanut butter", k: 220 },
                { t: "Lunch", f: "Lentil soup (large bowl) + whole wheat bread", k: 460 },
                { t: "Snack", f: "Carrots + hummus", k: 150 },
                { t: "Dinner", f: "Ground turkey (150g) + roasted vegetables", k: 400 },
            ]
        },
        {
            day: "Wed", meals: [
                { t: "Breakfast", f: "Cheese omelet (2 eggs, low oil) + cucumber", k: 280 },
                { t: "Snack", f: "Kefir (200ml) + handful of hazelnuts", k: 190 },
                { t: "Lunch", f: "Tuna salad (lettuce, tomato, olives, 100g tuna)", k: 380 },
                { t: "Snack", f: "Cottage cheese (100g) + 1 tsp honey", k: 160 },
                { t: "Dinner", f: "Grilled chicken (150g) + baked sweet potato (150g)", k: 450 },
            ]
        },
        {
            day: "Thu", meals: [
                { t: "Breakfast", f: "Whole grain granola (40g) + milk + strawberries", k: 340 },
                { t: "Snack", f: "1 orange + 10 cashews", k: 175 },
                { t: "Lunch", f: "Chickpea dish (1 bowl) + yogurt + salad", k: 490 },
                { t: "Snack", f: "Skim milk + 2 whole grain crackers", k: 140 },
                { t: "Dinner", f: "Baked sea bass (130g) + spinach with olive oil", k: 400 },
            ]
        },
        {
            day: "Fri", meals: [
                { t: "Breakfast", f: "Protein smoothie: milk 200ml + banana + 1 scoop protein", k: 310 },
                { t: "Snack", f: "Small handful mixed nuts", k: 190 },
                { t: "Lunch", f: "Whole wheat wrap: chicken + avocado + salad", k: 500 },
                { t: "Snack", f: "Apple + low-fat yogurt", k: 160 },
                { t: "Dinner", f: "Lean beef (120g) + tomato sauce + whole wheat pasta (70g)", k: 480 },
            ]
        },
        {
            day: "Sat", meals: [
                { t: "Breakfast", f: "Avocado whole wheat toast (2 slices) + boiled egg", k: 370 },
                { t: "Snack", f: "Fruit salad + 1 tbsp yogurt", k: 150 },
                { t: "Lunch", f: "Lentil patties (8-10 pcs) + tzatziki + salad", k: 430 },
                { t: "Snack", f: "Cheese (30g) + apple", k: 170 },
                { t: "Dinner", f: "Sardines (100g) + vegetables with olive oil sauce", k: 380 },
            ]
        },
        {
            day: "Sun", meals: [
                { t: "Breakfast", f: "Whole wheat crepes (2 pcs) + yogurt + honey", k: 360 },
                { t: "Snack", f: "Kefir + handful of almonds", k: 200 },
                { t: "Lunch", f: "Homemade chicken soup + whole grain bread", k: 420 },
                { t: "Snack", f: "Cottage cheese + cucumber", k: 120 },
                { t: "Dinner", f: "White beans (1 bowl) + bulgur pilaf + salad", k: 460 },
            ]
        },
    ],
    gain: [
        {
            day: "Mon", meals: [
                { t: "Breakfast", f: "3 egg omelet + 2 slices bread + milk (250ml)", k: 580 },
                { t: "Snack", f: "Banana + peanut butter (2 tbsp) + milk", k: 380 },
                { t: "Lunch", f: "Rice pilaf (200g) + grilled chicken (200g) + salad", k: 720 },
                { t: "Snack", f: "Protein bar + fruit", k: 320 },
                { t: "Dinner", f: "Beef steak (150g) + baked potatoes + broccoli", k: 640 },
            ]
        },
        {
            day: "Tue", meals: [
                { t: "Breakfast", f: "Protein pancakes (3 pcs) + banana + honey", k: 600 },
                { t: "Snack", f: "Milk + granola + yogurt", k: 400 },
                { t: "Lunch", f: "Pasta (100g dry) + meat sauce", k: 680 },
                { t: "Snack", f: "Boiled eggs (2) + whole wheat bread", k: 280 },
                { t: "Dinner", f: "Salmon (180g) + bulgur pilaf + vegetables", k: 650 },
            ]
        },
        {
            day: "Wed", meals: [
                { t: "Breakfast", f: "Oatmeal (70g) + milk + fruit + walnuts", k: 550 },
                { t: "Snack", f: "Smoothie: milk + banana + oats + 1 scoop protein", k: 420 },
                { t: "Lunch", f: "Chicken wrap (2 pcs) + buttermilk", k: 700 },
                { t: "Snack", f: "Cottage cheese + honey + whole bread", k: 300 },
                { t: "Dinner", f: "Turkey leg (200g) + boiled potatoes + salad", k: 620 },
            ]
        },
        {
            day: "Thu", meals: [
                { t: "Breakfast", f: "3 egg scramble + 2 slices bread + milk", k: 570 },
                { t: "Snack", f: "Avocado toast + egg", k: 380 },
                { t: "Lunch", f: "Chickpea rice (large portion) + tzatziki", k: 680 },
                { t: "Snack", f: "Milk + protein powder + banana", k: 380 },
                { t: "Dinner", f: "Grilled fish (200g) + vegetable pasta", k: 630 },
            ]
        },
        {
            day: "Fri", meals: [
                { t: "Breakfast", f: "Yogurt muesli (70g) + banana + strawberries", k: 520 },
                { t: "Snack", f: "Mixed nuts + cheese", k: 350 },
                { t: "Lunch", f: "Rice + chicken stir-fry (large portion)", k: 720 },
                { t: "Snack", f: "Milk + crackers + fruit", k: 290 },
                { t: "Dinner", f: "Lamb chops (150g) + bulgur + salad", k: 660 },
            ]
        },
        {
            day: "Sat", meals: [
                { t: "Breakfast", f: "Sunny side up eggs (3) + tomato + bread + milk", k: 580 },
                { t: "Snack", f: "Protein smoothie + banana", k: 380 },
                { t: "Lunch", f: "Wraps (2 pcs) + buttermilk + salad", k: 700 },
                { t: "Snack", f: "Granola bar + milk", k: 320 },
                { t: "Dinner", f: "Ground beef (150g) + pasta + cheese", k: 660 },
            ]
        },
        {
            day: "Sun", meals: [
                { t: "Breakfast", f: "Full breakfast: cheese, eggs, honey, olives, bread + milk", k: 600 },
                { t: "Snack", f: "Milk + walnuts + dried apricots", k: 320 },
                { t: "Lunch", f: "Meat chickpea stew (large bowl) + rice + salad", k: 720 },
                { t: "Snack", f: "Yogurt + fruit + granola", k: 280 },
                { t: "Dinner", f: "Chicken stir-fry (200g) + roasted vegetables + bread", k: 620 },
            ]
        },
    ],
    muscle: [
        {
            day: "Mon", meals: [
                { t: "Breakfast", f: "4 egg omelet + oats (60g) + banana", k: 620 },
                { t: "Snack", f: "Yogurt + granola + fruit", k: 350 },
                { t: "Lunch", f: "Grilled chicken (200g) + rice (200g) + salad", k: 720 },
                { t: "Post-workout", f: "Protein shake + banana", k: 300 },
                { t: "Dinner", f: "Salmon (150g) + sweet potato + broccoli", k: 540 },
            ]
        },
        {
            day: "Tue", meals: [
                { t: "Breakfast", f: "Protein pancakes (3) + blueberries + honey", k: 590 },
                { t: "Snack", f: "Cottage cheese + walnuts + apple", k: 280 },
                { t: "Lunch", f: "Turkey (200g) + bulgur (180g) + vegetables", k: 700 },
                { t: "Snack", f: "Boiled eggs (2) + whole wheat bread", k: 280 },
                { t: "Dinner", f: "Beef steak (150g) + roasted vegetables + salad", k: 560 },
            ]
        },
        {
            day: "Wed", meals: [
                { t: "Breakfast", f: "Oatmeal (70g) + milk + 2 eggs + fruit", k: 580 },
                { t: "Snack", f: "Protein smoothie (milk + protein + banana)", k: 380 },
                { t: "Lunch", f: "Tuna wraps (2 pcs) + vegetables", k: 650 },
                { t: "Snack", f: "Yogurt + almonds", k: 220 },
                { t: "Dinner", f: "Chicken (180g) + pasta (80g dry) + cheese", k: 640 },
            ]
        },
        {
            day: "Thu", meals: [
                { t: "Breakfast", f: "3 egg scramble + bread + milk", k: 560 },
                { t: "Snack", f: "Banana + peanut butter + milk", k: 350 },
                { t: "Lunch", f: "Chickpea salad (large) + chicken (150g) + rice", k: 720 },
                { t: "Post-workout", f: "Protein shake + banana or bread", k: 320 },
                { t: "Dinner", f: "Sea bass (150g) + quinoa + vegetables", k: 520 },
            ]
        },
        {
            day: "Fri", meals: [
                { t: "Breakfast", f: "Avocado toast (2) + 2 boiled eggs + milk", k: 570 },
                { t: "Snack", f: "Yogurt + granola + strawberries", k: 300 },
                { t: "Lunch", f: "Rice (200g) + chicken stir-fry (200g)", k: 700 },
                { t: "Snack", f: "Cottage cheese + apple", k: 200 },
                { t: "Dinner", f: "Lamb chops (150g) + bulgur + salad", k: 580 },
            ]
        },
        {
            day: "Sat", meals: [
                { t: "Breakfast", f: "Protein waffles (2) + banana + honey", k: 560 },
                { t: "Snack", f: "Milk + granola + walnuts", k: 360 },
                { t: "Lunch", f: "Ground beef (150g) + pasta + tomato sauce", k: 680 },
                { t: "Snack", f: "Protein bar", k: 250 },
                { t: "Dinner", f: "Chicken (200g) + potatoes (150g) + broccoli", k: 620 },
            ]
        },
        {
            day: "Sun", meals: [
                { t: "Breakfast", f: "Full spread: eggs, cheese, olives, tomato, bread + milk", k: 580 },
                { t: "Snack", f: "Fruit salad + yogurt", k: 200 },
                { t: "Lunch", f: "Lentil soup + whole bread + yogurt", k: 450 },
                { t: "Snack", f: "Protein smoothie", k: 300 },
                { t: "Dinner", f: "Salmon (180g) + rice (180g) + salad", k: 660 },
            ]
        },
    ],
    maintain: [
        {
            day: "Mon", meals: [
                { t: "Breakfast", f: "2 eggs + oats (50g) + fruit", k: 430 },
                { t: "Snack", f: "Yogurt + hazelnuts", k: 200 },
                { t: "Lunch", f: "Chicken (150g) + bulgur (150g) + salad", k: 560 },
                { t: "Snack", f: "Fruit + cottage cheese", k: 180 },
                { t: "Dinner", f: "Fish (130g) + vegetables + whole wheat bread", k: 450 },
            ]
        },
        {
            day: "Tue", meals: [
                { t: "Breakfast", f: "Whole wheat toast + avocado + boiled egg", k: 420 },
                { t: "Snack", f: "Apple + almonds", k: 185 },
                { t: "Lunch", f: "Lentil soup + whole bread + tzatziki", k: 490 },
                { t: "Snack", f: "Kefir + dried fruit", k: 180 },
                { t: "Dinner", f: "Turkey (150g) + roasted vegetables", k: 430 },
            ]
        },
        {
            day: "Wed", meals: [
                { t: "Breakfast", f: "Yogurt + granola + fruit", k: 380 },
                { t: "Snack", f: "Walnuts + cheese", k: 190 },
                { t: "Lunch", f: "Tuna salad + whole bread", k: 480 },
                { t: "Snack", f: "Milk + banana", k: 200 },
                { t: "Dinner", f: "Chicken stir-fry + rice (150g) + salad", k: 510 },
            ]
        },
        {
            day: "Thu", meals: [
                { t: "Breakfast", f: "2 egg omelet + vegetables + bread", k: 390 },
                { t: "Snack", f: "Apple + hazelnuts", k: 175 },
                { t: "Lunch", f: "Chickpea dish + yogurt + salad", k: 520 },
                { t: "Snack", f: "Light protein smoothie", k: 220 },
                { t: "Dinner", f: "Salmon (130g) + steamed vegetables", k: 440 },
            ]
        },
        {
            day: "Fri", meals: [
                { t: "Breakfast", f: "Muesli + milk + fruit", k: 410 },
                { t: "Snack", f: "Yogurt + honey", k: 160 },
                { t: "Lunch", f: "Wrap: chicken + salad + yogurt sauce", k: 530 },
                { t: "Snack", f: "Fruit + cottage cheese", k: 150 },
                { t: "Dinner", f: "Fish (130g) + potatoes (100g) + salad", k: 480 },
            ]
        },
        {
            day: "Sat", meals: [
                { t: "Breakfast", f: "Avocado toast + egg + milk", k: 430 },
                { t: "Snack", f: "Kefir + granola", k: 220 },
                { t: "Lunch", f: "Homemade meatballs (3) + bulgur + tzatziki", k: 560 },
                { t: "Snack", f: "Fruit salad", k: 130 },
                { t: "Dinner", f: "Turkey (130g) + pasta (70g) + salad", k: 490 },
            ]
        },
        {
            day: "Sun", meals: [
                { t: "Breakfast", f: "Weekend brunch (light portion)", k: 480 },
                { t: "Snack", f: "Yogurt + fruit", k: 160 },
                { t: "Lunch", f: "Lentil patties + buttermilk + salad", k: 430 },
                { t: "Snack", f: "Cheese + whole bread", k: 180 },
                { t: "Dinner", f: "Fish soup + whole bread", k: 400 },
            ]
        },
    ],
};

const exercisePlans = {
    lose: [
        { icon: "walking", title: "Daily Walking", desc: "30-45 min brisk walking. Burns ~200-300 kcal, improves insulin sensitivity." },
        { icon: "cycling", title: "Cardio 3x/week", desc: "Cycling, swimming or elliptical 30 min. Accelerates fat burning, low joint impact." },
        { icon: "weight", title: "Weights 2x/week", desc: "Resistance training is essential to preserve muscle mass while losing fat." },
        { icon: "yoga", title: "Active Recovery", desc: "Stress increases cortisol and makes weight loss harder. Add light yoga or breathing exercises." },
    ],
    gain: [
        { icon: "weight", title: "Compound Movements 4x/week", desc: "Squats, deadlifts, bench press are the most effective for muscle growth." },
        { icon: "sleep", title: "Rest and Sleep", desc: "Muscles grow during rest, not training. Aim for 7-9 hours of sleep." },
        { icon: "nutrition", title: "Post-workout Nutrition", desc: "Consume protein + carbs within 30-60 min after exercise." },
        { icon: "progress", title: "Progressive Overload", desc: "Increase weight or reps each week. Muscles need new stimuli to grow." },
    ],
    muscle: [
        { icon: "strength", title: "Progressive Overload", desc: "Increase weight or reps weekly. Continuous new stimulus is needed for muscle growth." },
        { icon: "split", title: "Split Training 4-5x/week", desc: "Push/pull/legs or upper/lower split is ideal for balance and intensity." },
        { icon: "stretch", title: "Mobility Work", desc: "10 min stretching after each workout. Reduces injury risk." },
        { icon: "protein", title: "High Protein Intake", desc: "1.8-2.2g protein per kg bodyweight. Pay special attention on training days." },
    ],
    maintain: [
        { icon: "cardio", title: "Mixed Cardio 2x/week", desc: "2x cardio + 2x strength training per week maintains overall health and energy." },
        { icon: "flexibility", title: "Flexibility Work", desc: "Yoga or stretching 2-3x/week. Improves posture, reduces tension." },
        { icon: "active", title: "Active Lifestyle", desc: "Take stairs, walk short distances. Aim for 8,000+ steps daily." },
        { icon: "balance", title: "Balance", desc: "Keep cardio and strength balanced. Only one can lead to muscle or fitness loss." },
    ],
};

function getExerciseIcon(type) {
    const icons = {
        walking: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <path d="M9 20l3-6 3 6M9 14l3-4 3 4M12 14v-4" />
            </svg>
        ),
        cycling: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <circle cx="15" cy="5" r="1" />
                <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
            </svg>
        ),
        weight: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 6.5a2 2 0 0 0-3 0 2 2 0 0 0 0 3l11 11a2 2 0 0 0 3 0 2 2 0 0 0 0-3z" />
                <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4 2.4 2.4 0 0 1-3.4 0L2.7 3.7a2.4 2.4 0 0 1 0-3.4 2.4 2.4 0 0 1 3.4 0z" />
            </svg>
        ),
        yoga: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
                <path d="M12 9v4l-4 4M12 13l4 4" />
            </svg>
        ),
        sleep: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        ),
        nutrition: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        ),
        progress: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
            </svg>
        ),
        strength: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 4l3 3-3 3" />
                <path d="M6 20l-3-3 3-3" />
                <path d="M21 7H8a4 4 0 0 0-4 4v2" />
                <path d="M3 17h13a4 4 0 0 0 4-4v-2" />
            </svg>
        ),
        split: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
        stretch: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <path d="M6 21l6-6 6 6M12 15V9" />
            </svg>
        ),
        protein: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 11h.01M11 15h.01M16 16c2.8-2.8 2.8-5.2 0-8-2.8-2.8-5.2-2.8-8 0-2.8 2.8-2.8 5.2 0 8 2.8 2.8 5.2 2.8 8 0z" />
                <path d="M9 9c-2 2-2.5 3.5-1 5s3 1 5-1" />
            </svg>
        ),
        cardio: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        flexibility: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <path d="M7 21l5-10 5 10M12 11v-4" />
            </svg>
        ),
        active: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        balance: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M3 12h18M5 5l14 14M19 5L5 19" />
            </svg>
        ),
    };
    return icons[type] || icons.weight;
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

const emptyMeal = () => ({ name: "", kcal: "", protein: "", carb: "", fat: "" });

function DietPlanSection({ data, targets, goalCal }) {
    const [activeDay, setActiveDay] = useState(0);
    const plan = weeklyPlans[data.goal] || weeklyPlans.maintain;
    const exList = exercisePlans[data.goal] || exercisePlans.maintain;
    const dayData = plan[activeDay];
    const dayTotal = dayData.meals.reduce((a, m) => a + m.k, 0);

    const goalLabels = {
        lose: "Weight Loss",
        gain: "Weight Gain",
        muscle: "Muscle Building",
        maintain: "Maintenance"
    };

    return (
        <div className="diet-plan-section">
            <div className="diet-plan-header">
                <div className="diet-plan-badge">{goalLabels[data.goal] || "Personalized"} Plan</div>
                <h2 className="diet-plan-title">Your Daily Diet Plan</h2>
                <p className="diet-plan-subtitle">Follow this plan to reach your goals. Adjust portions as needed.</p>
            </div>

            <div className="daily-targets">
                <div className="target-card">
                    <span className="target-value">{Math.round(goalCal)}</span>
                    <span className="target-label">kcal</span>
                </div>
                <div className="target-card">
                    <span className="target-value">{targets.protein}</span>
                    <span className="target-label">Protein (g)</span>
                </div>
                <div className="target-card">
                    <span className="target-value">{targets.carb}</span>
                    <span className="target-label">Carbs (g)</span>
                </div>
                <div className="target-card">
                    <span className="target-value">{targets.fat}</span>
                    <span className="target-label">Fat (g)</span>
                </div>
                <div className="target-card">
                    <span className="target-value">{targets.water}</span>
                    <span className="target-label">Water (ml)</span>
                </div>
            </div>

            <div className="weekly-plan">
                <h3 className="section-title">Weekly Meal Plan</h3>
                <div className="day-tabs">
                    {plan.map((d, i) => (
                        <button
                            key={i}
                            className={`day-btn${activeDay === i ? " day-btn--active" : ""}`}
                            onClick={() => setActiveDay(i)}
                        >
                            {d.day}
                        </button>
                    ))}
                </div>
                <div className="meal-list">
                    {dayData.meals.map((m, i) => (
                        <div className="meal-row" key={i}>
                            <span className="meal-time">{m.t}</span>
                            <span className="meal-food">{m.f}</span>
                            <span className="meal-kcal">{m.k} kcal</span>
                        </div>
                    ))}
                    <div className="meal-total">
                        <span>Daily Total</span>
                        <span>{dayTotal} kcal</span>
                    </div>
                </div>
            </div>

            <div className="exercise-plan">
                <h3 className="section-title">Recommended Exercises</h3>
                <div className="exercise-list">
                    {exList.map((ex, i) => (
                        <div className="exercise-card" key={i}>
                            <div className="exercise-icon">{getExerciseIcon(ex.icon)}</div>
                            <div className="exercise-content">
                                <div className="exercise-title">{ex.title}</div>
                                <div className="exercise-desc">{ex.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FoodLogSection({ data, update, errors }) {
    const meals = data.meals_log || [emptyMeal()];

    const setMeals = (newMeals) => update("meals_log", newMeals);

    const updateMeal = (i, key, val) => {
        const updated = meals.map((m, idx) => (idx === i ? { ...m, [key]: val } : m));
        setMeals(updated);
    };

    const addMeal = () => setMeals([...meals, emptyMeal()]);
    const removeMeal = (i) => setMeals(meals.filter((_, idx) => idx !== i));

    return (
        <div className="food-log-section">
            <div className="food-log-header">
                <h2 className="food-log-title">What Did You Eat Today?</h2>
                <p className="food-log-subtitle">Log your meals to track your progress. Values can be approximate.</p>
            </div>

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
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
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
        </div>
    );
}

export default function MealsPage() {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState("plan");

    const savedData = JSON.parse(sessionStorage.getItem("calcData") || "null");
    const [calcData, setCalcData] = useState(savedData || {
        meals_log: [{ name: "", kcal: "", protein: "", carb: "", fat: "" }],
        water: ""
    });
    const [errors, setErrors] = useState({});

    const tdee = calcTDEE(calcData);
    const goalCal = getGoalCal(tdee, calcData.goal);
    const targets = {
        kcal: goalCal,
        protein: Math.round((goalCal * 0.30) / 4),
        carb: Math.round((goalCal * 0.40) / 4),
        fat: Math.round((goalCal * 0.30) / 9),
        water: Math.round((+calcData.weight || 70) * 35),
    };

    const update = (key, value) => {
        const updated = { ...calcData, [key]: value };
        setCalcData(updated);
        sessionStorage.setItem("calcData", JSON.stringify(updated));
    };

    const validate = () => {
        const e = {};
        const logs = calcData?.meals_log || [];
        const hasKcal = logs.some((m) => parseFloat(m.kcal) > 0);
        if (!hasKcal) e.meal_kcal = "Enter calories for at least one meal";
        if (!calcData?.water || parseFloat(calcData.water) <= 0) e.water = "Enter water intake";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleBack = () => {
        navigate("/calculator");
    };

    const handleResult = () => {
        if (validate()) {
            sessionStorage.setItem("calcData", JSON.stringify(calcData));
            navigate("/result");
        }
    };

    const handleContinueToLog = () => {
        setActiveView("log");
    };

    return (

        <main className="meals-page">
            <div className="meals-container">
                <div className="meals-card">
                    <div className="view-tabs">
                        <button
                            className={`view-tab${activeView === "plan" ? " view-tab--active" : ""}`}
                            onClick={() => setActiveView("plan")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                            Diet Plan
                        </button>
                        <button
                            className={`view-tab${activeView === "log" ? " view-tab--active" : ""}`}
                            onClick={() => setActiveView("log")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Log Food
                        </button>
                    </div>

                    <div className="hc-step-animate">
                        {activeView === "plan" ? (
                            <DietPlanSection data={calcData} targets={targets} goalCal={goalCal} />
                        ) : (
                            <FoodLogSection data={calcData} update={update} errors={errors} />
                        )}
                    </div>

                    <div className="hc-nav">
                        <button className="hc-btn-back" onClick={handleBack}>Back</button>
                        {activeView === "plan" ? (
                            <button className="hc-btn-next" onClick={handleContinueToLog}>
                                Continue to Log Food
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        ) : (
                            <button className="hc-btn-next" onClick={handleResult}>
                                See Results
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </main>
    );
}

