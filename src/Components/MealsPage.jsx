import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Style/MealsPage.css';

// ─── TDEE & Macro Calculations ───────────────────────────────────────────────
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

// ─── DIET DATA ────────────────────────────────────────────────────────────────
// Each meal has: t=time, f=food (normal), fv=vegetarian alt, fvg=vegan alt, fb=budget alt, k=kcal, p=protein, c=carbs, fat=fat
const weeklyPlans = {
    lose: [
        {
            day: "Mon", meals: [
                { t: "Breakfast", f: "2 boiled eggs + 1 slice whole wheat bread + tomato", fv: "2 boiled eggs + whole wheat bread + tomato + cucumber", fvg: "Tofu scramble (100g) + whole wheat toast + tomato", fb: "2 eggs + stale bread (toasted) + seasonal vegetables", k: 320, p: 22, c: 28, fat: 10 },
                { t: "Snack", f: "Apple + 10 almonds", fv: "Apple + 10 almonds", fvg: "Apple + 10 almonds", fb: "Seasonal fruit + sunflower seeds (cheap)", k: 180, p: 4, c: 24, fat: 8 },
                { t: "Lunch", f: "Grilled chicken (150g) + quinoa (½ cup) + salad", fv: "Lentil patties (5 pcs) + quinoa + salad", fvg: "Chickpea salad + quinoa + olive oil", fb: "Canned tuna (100g) + rice + tomato salad", k: 480, p: 38, c: 42, fat: 12 },
                { t: "Snack", f: "Low-fat yogurt (150g) + walnuts (small handful)", fv: "Low-fat yogurt + walnuts", fvg: "Soy yogurt + walnuts", fb: "Plain yogurt + dried apricots (3 pcs)", k: 200, p: 10, c: 14, fat: 11 },
                { t: "Dinner", f: "Baked salmon (120g) + steamed broccoli + olive oil", fv: "Baked fish-free: tofu (150g) + broccoli + olive oil", fvg: "Marinated & baked tofu (150g) + broccoli + olive oil", fb: "Canned mackerel (100g) + steamed vegetables + bread", k: 420, p: 32, c: 12, fat: 18 },
            ]
        },
        {
            day: "Tue", meals: [
                { t: "Breakfast", f: "Oatmeal (50g) + blueberries + 1 tbsp chia seeds", fv: "Oatmeal (50g) + blueberries + chia seeds", fvg: "Oatmeal + banana + flaxseed + plant milk", fb: "Oatmeal + banana + sunflower seeds", k: 330, p: 10, c: 52, fat: 8 },
                { t: "Snack", f: "1 banana + 2 tbsp peanut butter", fv: "Banana + peanut butter", fvg: "Banana + peanut butter", fb: "Banana + sunflower seed paste", k: 220, p: 6, c: 30, fat: 9 },
                { t: "Lunch", f: "Lentil soup (large bowl) + whole wheat bread", fv: "Lentil soup + whole wheat bread + tzatziki", fvg: "Red lentil soup + whole wheat bread + salad", fb: "Red lentil soup (very economical) + cheap bread + onion", k: 460, p: 22, c: 68, fat: 8 },
                { t: "Snack", f: "Carrots + hummus (3 tbsp)", fv: "Carrots + hummus", fvg: "Carrots + hummus", fb: "Carrots + tahini (small amount)", k: 150, p: 5, c: 18, fat: 7 },
                { t: "Dinner", f: "Ground turkey (150g) + roasted vegetables", fv: "Mushroom & zucchini pan (large) + whole wheat bread", fvg: "Roasted mushroom (200g) + lentils + vegetables", fb: "Ground beef (100g cheaper) + oven vegetables + rice", k: 400, p: 30, c: 22, fat: 16 },
            ]
        },
        {
            day: "Wed", meals: [
                { t: "Breakfast", f: "2-egg cheese omelet (low oil) + cucumber", fv: "2-egg cheese omelet + cucumber + tomato", fvg: "Tofu scramble + nutritional yeast + cucumber", fb: "2 eggs + 1 slice cheese + cucumber (minimal oil)", k: 280, p: 20, c: 6, fat: 18 },
                { t: "Snack", f: "Kefir (200ml) + hazelnuts (small handful)", fv: "Kefir + hazelnuts", fvg: "Soy kefir + hazelnuts", fb: "Ayran (cheap) + sunflower seeds", k: 190, p: 8, c: 12, fat: 12 },
                { t: "Lunch", f: "Tuna salad (lettuce, tomato, olives, 100g tuna)", fv: "Egg salad (2 boiled eggs) + lettuce + tomato + olives", fvg: "Chickpea salad + lettuce + olives + olive oil", fb: "Canned tuna + seasonal salad + olive oil", k: 380, p: 30, c: 16, fat: 20 },
                { t: "Snack", f: "Cottage cheese (100g) + 1 tsp honey", fv: "Cottage cheese + honey", fvg: "Almond milk yogurt + honey", fb: "Plain cottage cheese + marmalade", k: 160, p: 14, c: 12, fat: 6 },
                { t: "Dinner", f: "Grilled chicken (150g) + baked sweet potato (150g)", fv: "Grilled halloumi (100g) + baked sweet potato", fvg: "Baked sweet potato (200g) + black beans + avocado", fb: "Chicken thigh (cheaper, 150g) + boiled potato + salad", k: 450, p: 34, c: 42, fat: 10 },
            ]
        },
        {
            day: "Thu", meals: [
                { t: "Breakfast", f: "Whole grain granola (40g) + milk + strawberries", fv: "Granola + milk + strawberries + chia", fvg: "Granola + oat milk + strawberries", fb: "Oatmeal + milk + seasonal fruit (economical)", k: 340, p: 12, c: 52, fat: 10 },
                { t: "Snack", f: "1 orange + 10 cashews", fv: "Orange + cashews", fvg: "Orange + cashews", fb: "Seasonal fruit + sunflower seeds", k: 175, p: 4, c: 22, fat: 9 },
                { t: "Lunch", f: "Chickpea dish (1 bowl) + yogurt + salad", fv: "Chickpea dish + yogurt + salad", fvg: "Chickpea dish (large) + tahini sauce + salad", fb: "Dry chickpea dish (very cheap) + plain yogurt + onion salad", k: 490, p: 20, c: 64, fat: 12 },
                { t: "Snack", f: "Skim milk + 2 whole grain crackers", fv: "Skim milk + crackers", fvg: "Oat milk + rice crackers", fb: "Ayran + plain bread", k: 140, p: 8, c: 18, fat: 2 },
                { t: "Dinner", f: "Baked sea bass (130g) + spinach with olive oil", fv: "Baked halloumi + spinach with olive oil", fvg: "Sautéed tempeh (120g) + spinach with olive oil", fb: "Canned sardines (100g) + pan-cooked spinach with garlic", k: 400, p: 28, c: 8, fat: 22 },
            ]
        },
        {
            day: "Fri", meals: [
                { t: "Breakfast", f: "Protein smoothie: milk 200ml + banana + protein (1 scoop)", fv: "Smoothie: milk + banana + yogurt + nut butter", fvg: "Smoothie: oat milk + banana + flaxseed + almond butter", fb: "Milk + banana + oats (blended)", k: 310, p: 28, c: 36, fat: 5 },
                { t: "Snack", f: "Small handful mixed nuts", fv: "Mixed nuts", fvg: "Mixed nuts", fb: "Sunflower + pumpkin seeds (economical)", k: 190, p: 6, c: 8, fat: 16 },
                { t: "Lunch", f: "Whole wheat wrap: chicken + avocado + salad", fv: "Whole wheat wrap: egg + avocado + salad", fvg: "Whole wheat wrap: hummus + avocado + salad", fb: "Regular wrap: canned tuna + yogurt sauce + salad", k: 500, p: 30, c: 42, fat: 18 },
                { t: "Snack", f: "Apple + low-fat yogurt", fv: "Apple + low-fat yogurt", fvg: "Apple + soy yogurt", fb: "Apple + plain ayran", k: 160, p: 6, c: 24, fat: 2 },
                { t: "Dinner", f: "Lean beef (120g) + tomato sauce + whole wheat pasta (70g)", fv: "Soy mince (100g) + tomato sauce + whole wheat pasta", fvg: "Lentil Bolognese + whole wheat pasta (70g)", fb: "Ground beef (100g) + tomato pasta + cheap pasta", k: 480, p: 32, c: 48, fat: 14 },
            ]
        },
        {
            day: "Sat", meals: [
                { t: "Breakfast", f: "Avocado whole wheat toast (2 slices) + boiled egg", fv: "Avocado toast + boiled egg + tomato", fvg: "Avocado toast + hemp seeds + tomato", fb: "Egg toast + tahini (instead of avocado, economical)", k: 370, p: 16, c: 32, fat: 20 },
                { t: "Snack", f: "Fruit salad + 1 tbsp yogurt", fv: "Fruit salad + yogurt", fvg: "Fruit salad + coconut yogurt", fb: "Seasonal fruit salad", k: 150, p: 3, c: 30, fat: 2 },
                { t: "Lunch", f: "Lentil patties (8-10 pcs) + tzatziki + salad", fv: "Lentil patties + tzatziki + salad", fvg: "Lentil patties + tahini + salad", fb: "Red lentil patties + plain yogurt + tomato + onion", k: 430, p: 22, c: 52, fat: 12 },
                { t: "Snack", f: "Cheese (30g) + apple", fv: "Cheese + apple", fvg: "Vegan cheese (or cashew paste) + apple", fb: "Any cheese + seasonal fruit", k: 170, p: 8, c: 16, fat: 9 },
                { t: "Dinner", f: "Sardines (100g) + vegetables with olive oil sauce", fv: "Egg frittata (3 eggs) + vegetables", fvg: "Roasted vegetable dish (large) + tahini drizzle", fb: "Canned sardines (very economical) + bread + salad", k: 380, p: 26, c: 14, fat: 22 },
            ]
        },
        {
            day: "Sun", meals: [
                { t: "Breakfast", f: "Whole wheat crepes (2 pcs) + yogurt + honey", fv: "Whole wheat crepes + yogurt + honey", fvg: "Oat crepes + plant yogurt + honey", fb: "Pan pancakes (flour + egg + milk) + honey", k: 360, p: 14, c: 52, fat: 10 },
                { t: "Snack", f: "Kefir + handful of almonds", fv: "Kefir + almonds", fvg: "Soy kefir + almonds", fb: "Ayran + sunflower seeds", k: 200, p: 10, c: 10, fat: 14 },
                { t: "Lunch", f: "Homemade chicken soup + whole grain bread", fv: "Vegetable soup (rich) + whole grain bread + egg", fvg: "Thick vegetable soup + whole wheat bread + tahini", fb: "Lentil soup (cheapest option) + bread + onion", k: 420, p: 24, c: 46, fat: 10 },
                { t: "Snack", f: "Cottage cheese + cucumber", fv: "Cottage cheese + cucumber + dill", fvg: "Hummus + cucumber sticks", fb: "Plain yogurt + cucumber + salt", k: 120, p: 10, c: 6, fat: 5 },
                { t: "Dinner", f: "White beans (1 bowl) + bulgur pilaf + salad", fv: "White beans + bulgur + salad", fvg: "White beans + bulgur + salad (naturally vegan!)", fb: "White beans + rice (instead of bulgur, cheaper) + onion salad", k: 460, p: 20, c: 72, fat: 8 },
            ]
        },
    ],
    gain: [
        {
            day: "Mon", meals: [
                { t: "Breakfast", f: "3 egg omelet + 2 slices bread + milk (250ml)", fv: "3 egg omelet + 2 bread + milk + cheese", fvg: "Tofu scramble (150g) + 2 bread + soy milk + nut butter", fb: "3 eggs + stale bread + milk (economical breakfast)", k: 580, p: 38, c: 52, fat: 20 },
                { t: "Snack", f: "Banana + peanut butter (2 tbsp) + milk", fv: "Banana + peanut butter + milk + granola", fvg: "Banana + peanut butter + oat milk + oats", fb: "Banana + sunflower seed paste + milk", k: 380, p: 14, c: 50, fat: 14 },
                { t: "Lunch", f: "Rice pilaf (200g) + grilled chicken (200g) + salad", fv: "Rice pilaf + grilled halloumi (150g) + salad", fvg: "Rice pilaf + marinated tempeh (150g) + salad", fb: "Rice + chicken thigh (cheaper) + tomato salad", k: 720, p: 48, c: 72, fat: 18 },
                { t: "Snack", f: "Protein bar + fruit", fv: "Protein bar + fruit + yogurt", fvg: "Date + almond butter + oats energy ball", fb: "Bread + peanut butter + banana", k: 320, p: 18, c: 42, fat: 10 },
                { t: "Dinner", f: "Beef steak (150g) + baked potatoes + broccoli", fv: "Cottage cheese-egg-mushroom patties + potatoes + broccoli", fvg: "Lentil-mushroom patties + baked potatoes + broccoli", fb: "Ground beef (150g) + mashed potatoes + seasonal salad", k: 640, p: 42, c: 58, fat: 22 },
            ]
        },
        {
            day: "Tue", meals: [
                { t: "Breakfast", f: "Protein pancakes (3 pcs) + banana + honey", fv: "Protein pancakes (egg-based) + banana + honey", fvg: "Oat pancakes (plant protein) + banana + maple syrup", fb: "Regular pancakes (flour+egg+milk) + banana + honey", k: 600, p: 36, c: 78, fat: 14 },
                { t: "Snack", f: "Milk + granola + yogurt", fv: "Milk + granola + yogurt + nuts", fvg: "Oat milk + granola + plant yogurt", fb: "Milk + homemade granola + plain yogurt", k: 400, p: 16, c: 56, fat: 12 },
                { t: "Lunch", f: "Pasta (100g dry) + meat sauce", fv: "Pasta + soy mince sauce + parmesan", fvg: "Pasta + lentil tomato sauce + nutritional yeast", fb: "Pasta + ground beef + tomato paste sauce", k: 680, p: 38, c: 82, fat: 18 },
                { t: "Snack", f: "2 boiled eggs + whole wheat bread", fv: "2 boiled eggs + whole wheat bread + avocado", fvg: "Edamame (1 cup) + whole wheat bread + tahini", fb: "2 eggs + bread + butter", k: 280, p: 18, c: 28, fat: 10 },
                { t: "Dinner", f: "Salmon (180g) + bulgur pilaf + vegetables", fv: "Grilled fish (or halloumi) + bulgur + vegetables", fvg: "Marinated baked tofu (180g) + bulgur + vegetables", fb: "Canned mackerel + bulgur + oven vegetables", k: 650, p: 44, c: 62, fat: 20 },
            ]
        },
        {
            day: "Wed", meals: [
                { t: "Breakfast", f: "Oatmeal (70g) + milk + fruit + walnuts", fv: "Oatmeal + milk + fruit + walnuts + chia", fvg: "Oatmeal (70g) + oat milk + banana + walnuts + flaxseed", fb: "Oatmeal (70g) + milk + banana + sunflower seeds", k: 550, p: 18, c: 72, fat: 20 },
                { t: "Snack", f: "Smoothie: milk + banana + oats + protein (1 scoop)", fv: "Smoothie: milk + banana + oats + Greek yogurt", fvg: "Smoothie: oat milk + banana + oats + hemp protein", fb: "Blender: milk + banana + oats + egg (instead of protein)", k: 420, p: 30, c: 56, fat: 10 },
                { t: "Lunch", f: "Chicken wrap (2 pcs) + ayran", fv: "Halloumi wrap (2 pcs) + ayran", fvg: "Hummus wrap (2 pcs) + soy yogurt drink", fb: "Chicken wrap (chicken thigh, cheaper) + homemade ayran", k: 700, p: 40, c: 72, fat: 22 },
                { t: "Snack", f: "Cottage cheese + honey + whole bread", fv: "Cottage cheese + honey + whole bread", fvg: "Cashew cream + agave + whole bread", fb: "Plain cottage cheese + marmalade + bread", k: 300, p: 18, c: 36, fat: 8 },
                { t: "Dinner", f: "Turkey leg (200g) + boiled potatoes + salad", fv: "Mushroom-lentil stew (rich) + potatoes + salad", fvg: "Chickpea-mushroom stew + potatoes + salad", fb: "Chicken (200g, thigh) + boiled potatoes + onion salad", k: 620, p: 42, c: 58, fat: 18 },
            ]
        },
        {
            day: "Thu", meals: [
                { t: "Breakfast", f: "3 egg scramble + 2 slices bread + milk", fv: "3 egg scramble + cheese + bread + milk", fvg: "Tofu scramble + nutritional yeast + bread + soy milk", fb: "3 scrambled eggs + bread + milk (simple and cheap)", k: 570, p: 36, c: 50, fat: 22 },
                { t: "Snack", f: "Avocado toast + egg", fv: "Avocado toast + 2 eggs", fvg: "Avocado toast + hemp seeds + tahini", fb: "Tahini toast + boiled egg (avocado alternative)", k: 380, p: 16, c: 32, fat: 22 },
                { t: "Lunch", f: "Chickpea rice (large portion) + tzatziki", fv: "Chickpea rice + tzatziki + egg", fvg: "Chickpea rice (large) + tahini sauce + lemon", fb: "Chickpea rice (dry chickpea, economical) + plain yogurt", k: 680, p: 28, c: 88, fat: 14 },
                { t: "Snack", f: "Milk + protein powder + banana", fv: "Milk + Greek yogurt + banana (blended)", fvg: "Oat milk + hemp protein + banana", fb: "Milk + banana + oats (blended, no powder needed)", k: 380, p: 30, c: 52, fat: 6 },
                { t: "Dinner", f: "Grilled fish (200g) + vegetable pasta", fv: "Grilled halloumi (150g) + vegetable pasta", fvg: "Baked tempeh (150g) + vegetable pasta", fb: "Canned mackerel + cheap pasta + tomato sauce", k: 630, p: 40, c: 62, fat: 20 },
            ]
        },
        {
            day: "Fri", meals: [
                { t: "Breakfast", f: "Yogurt muesli (70g) + banana + strawberries", fv: "Muesli + yogurt + banana + strawberries + nuts", fvg: "Muesli + plant yogurt + banana + berries", fb: "Homemade muesli (oat + raisin + sunflower) + yogurt", k: 520, p: 16, c: 78, fat: 14 },
                { t: "Snack", f: "Mixed nuts + cheese", fv: "Mixed nuts + various cheeses", fvg: "Mixed nuts + dates", fb: "Sunflower seeds + pumpkin seeds + cheap cheese", k: 350, p: 12, c: 16, fat: 26 },
                { t: "Lunch", f: "Rice + chicken stir-fry (large portion)", fv: "Rice + egg stir-fry + vegetables (large)", fvg: "Rice + tofu stir-fry + vegetables (large)", fb: "Rice + chicken liver (very economical) + vegetable stir-fry", k: 720, p: 44, c: 78, fat: 18 },
                { t: "Snack", f: "Milk + crackers + fruit", fv: "Milk + crackers + fruit + cheese", fvg: "Plant milk + rice crackers + fruit", fb: "Milk + plain bread + banana", k: 290, p: 10, c: 42, fat: 8 },
                { t: "Dinner", f: "Lamb chops (150g) + bulgur + salad", fv: "Lentil-mushroom patties (4) + bulgur + salad", fvg: "Lentil patties (4) + bulgur + salad", fb: "Ground beef (150g) + bulgur + tomato salad", k: 660, p: 40, c: 62, fat: 26 },
            ]
        },
        {
            day: "Sat", meals: [
                { t: "Breakfast", f: "Sunny side up eggs (3) + tomato + bread + milk", fv: "3 eggs + cheese + tomato + bread + milk", fvg: "Scrambled tofu + tomato + bread + soy milk", fb: "3 eggs + tomato + bread + milk (classic economical breakfast)", k: 580, p: 36, c: 52, fat: 24 },
                { t: "Snack", f: "Protein smoothie + banana", fv: "Smoothie: milk + Greek yogurt + banana + oats", fvg: "Smoothie: oat milk + plant protein + banana", fb: "Blended: milk + banana + egg + oats", k: 380, p: 28, c: 52, fat: 8 },
                { t: "Lunch", f: "Wraps (2 pcs) + ayran + salad", fv: "Halloumi wraps (2) + ayran + salad", fvg: "Falafel wraps (2) + salad + tahini sauce", fb: "Chicken wraps (chicken thigh, cheap) + homemade ayran", k: 700, p: 38, c: 74, fat: 24 },
                { t: "Snack", f: "Granola bar + milk", fv: "Granola bar + milk + yogurt", fvg: "Date-oat energy ball + oat milk", fb: "Homemade granola bar (oats+honey+peanut butter)", k: 320, p: 12, c: 46, fat: 10 },
                { t: "Dinner", f: "Ground beef (150g) + pasta + cheese", fv: "Soy mince + pasta + parmesan", fvg: "Lentil Bolognese + pasta + nutritional yeast", fb: "Ground beef (150g, cheap) + pasta + minimal cheese", k: 660, p: 40, c: 68, fat: 22 },
            ]
        },
        {
            day: "Sun", meals: [
                { t: "Breakfast", f: "Full breakfast: cheese, eggs, honey, olives, bread + milk", fv: "Full vegetarian breakfast: eggs, cheese, olives, honey, bread", fvg: "Vegan full: tofu, tahini, olives, tomato, whole bread, plant milk", fb: "Full economic: 2 eggs + cheese + bread + olive + tea", k: 600, p: 32, c: 62, fat: 26 },
                { t: "Snack", f: "Milk + walnuts + dried apricots", fv: "Milk + walnuts + dried apricots + dates", fvg: "Oat milk + walnuts + dried apricots", fb: "Milk + sunflower seeds + raisins", k: 320, p: 10, c: 36, fat: 16 },
                { t: "Lunch", f: "Meat chickpea stew (large bowl) + rice + salad", fv: "Chickpea-egg stew + rice + salad", fvg: "Chickpea-vegetable stew (large) + rice + salad", fb: "Chickpea stew (dry chickpea, very cheap) + rice + onion", k: 720, p: 36, c: 86, fat: 18 },
                { t: "Snack", f: "Yogurt + fruit + granola", fv: "Yogurt + fruit + granola", fvg: "Plant yogurt + fruit + granola", fb: "Plain yogurt + banana + homemade granola", k: 280, p: 10, c: 42, fat: 8 },
                { t: "Dinner", f: "Chicken stir-fry (200g) + roasted vegetables + bread", fv: "Halloumi stir-fry + roasted vegetables + bread", fvg: "Marinated tofu stir-fry + roasted vegetables + bread", fb: "Chicken breast (budget) + oven vegetables + bread", k: 620, p: 42, c: 56, fat: 20 },
            ]
        },
    ],
    muscle: [
        {
            day: "Mon", meals: [
                { t: "Breakfast", f: "4 egg omelet + oats (60g) + banana", fv: "4 egg omelet + oats + banana + protein powder (optional)", fvg: "Tofu scramble (150g) + oats (60g) + banana", fb: "4 scrambled eggs + oats + banana (basic muscle breakfast)", k: 620, p: 42, c: 64, fat: 18 },
                { t: "Snack", f: "Yogurt + granola + fruit", fv: "Greek yogurt + granola + fruit + nuts", fvg: "Soy yogurt + granola + fruit + hemp seeds", fb: "Plain yogurt + homemade granola + banana", k: 350, p: 18, c: 48, fat: 10 },
                { t: "Lunch", f: "Grilled chicken (200g) + rice (200g) + salad", fv: "Grilled halloumi (150g) + rice (200g) + salad", fvg: "Marinated tempeh (150g) + rice (200g) + salad", fb: "Chicken thigh (200g, cheaper) + rice + tomato salad", k: 720, p: 52, c: 78, fat: 16 },
                { t: "Post-workout", f: "Protein shake + banana", fv: "Milk + Greek yogurt + banana (blended)", fvg: "Oat milk + plant protein + banana", fb: "Milk + banana + egg (protein-rich, economical)", k: 300, p: 30, c: 36, fat: 4 },
                { t: "Dinner", f: "Salmon (150g) + sweet potato + broccoli", fv: "Baked halloumi (120g) + sweet potato + broccoli", fvg: "Baked tofu (150g) + sweet potato + broccoli", fb: "Canned mackerel (150g) + boiled sweet potato + broccoli", k: 540, p: 38, c: 52, fat: 16 },
            ]
        },
        {
            day: "Tue", meals: [
                { t: "Breakfast", f: "Protein pancakes (3) + blueberries + honey", fv: "Egg protein pancakes + blueberries + honey", fvg: "Oat-banana pancakes + blueberries + maple syrup", fb: "Flour+egg+milk pancakes + fruit + honey", k: 590, p: 40, c: 72, fat: 14 },
                { t: "Snack", f: "Cottage cheese + walnuts + apple", fv: "Cottage cheese + walnuts + apple", fvg: "Silken tofu + walnuts + apple + agave", fb: "Cottage cheese + apple + sunflower seeds", k: 280, p: 22, c: 24, fat: 12 },
                { t: "Lunch", f: "Turkey (200g) + bulgur (180g) + vegetables", fv: "2-egg omelette + cheese + bulgur + vegetables", fvg: "Lentil-mushroom patties (5) + bulgur + vegetables", fb: "Ground turkey (200g) + bulgur + seasonal salad", k: 700, p: 48, c: 72, fat: 18 },
                { t: "Snack", f: "2 boiled eggs + whole wheat bread", fv: "2 boiled eggs + whole wheat bread + avocado", fvg: "Edamame (1 cup) + whole wheat bread", fb: "2 eggs + bread (simple and effective)", k: 280, p: 18, c: 28, fat: 10 },
                { t: "Dinner", f: "Beef steak (150g) + roasted vegetables + salad", fv: "Egg frittata (4 eggs) + cheese + vegetables", fvg: "Black bean burger (150g patty) + roasted vegetables", fb: "Ground beef (150g) + oven vegetables + salad", k: 560, p: 42, c: 28, fat: 24 },
            ]
        },
        {
            day: "Wed", meals: [
                { t: "Breakfast", f: "Oatmeal (70g) + milk + 2 eggs + fruit", fv: "Oatmeal + milk + 2 eggs + fruit + nuts", fvg: "Oatmeal (70g) + soy milk + hemp protein + fruit", fb: "Oatmeal (70g) + milk + 2 eggs + banana", k: 580, p: 36, c: 72, fat: 16 },
                { t: "Snack", f: "Protein smoothie (milk + protein + banana)", fv: "Milk + Greek yogurt + banana + oats", fvg: "Oat milk + hemp protein + banana + flaxseed", fb: "Milk + egg + banana + oats (blended)", k: 380, p: 32, c: 48, fat: 8 },
                { t: "Lunch", f: "Tuna wraps (2 pcs) + vegetables", fv: "Egg-avocado wraps (2) + vegetables", fvg: "Hummus-avocado wraps (2) + vegetables", fb: "Canned tuna wraps (2) + seasonal vegetables", k: 650, p: 44, c: 66, fat: 18 },
                { t: "Snack", f: "Yogurt + almonds", fv: "Greek yogurt + almonds + honey", fvg: "Soy yogurt + almonds + agave", fb: "Plain yogurt + sunflower seeds", k: 220, p: 14, c: 16, fat: 12 },
                { t: "Dinner", f: "Chicken (180g) + pasta (80g dry) + cheese", fv: "Soy mince + pasta + cheese", fvg: "Lentil sauce + pasta + nutritional yeast", fb: "Chicken breast (180g) + pasta + minimal cheese", k: 640, p: 48, c: 64, fat: 18 },
            ]
        },
        {
            day: "Thu", meals: [
                { t: "Breakfast", f: "3 egg scramble + bread + milk", fv: "3 egg scramble + cheese + bread + milk", fvg: "Tofu scramble + nutritional yeast + bread + soy milk", fb: "3 scrambled eggs + bread + milk", k: 560, p: 38, c: 50, fat: 20 },
                { t: "Snack", f: "Banana + peanut butter + milk", fv: "Banana + peanut butter + milk + granola", fvg: "Banana + almond butter + oat milk", fb: "Banana + sunflower seed paste + milk", k: 350, p: 16, c: 48, fat: 12 },
                { t: "Lunch", f: "Chickpea salad (large) + chicken (150g) + rice", fv: "Chickpea salad + hard boiled eggs (2) + rice", fvg: "Chickpea salad (large) + quinoa + olive oil", fb: "Chickpea + chicken liver (economical) + rice + salad", k: 720, p: 48, c: 80, fat: 16 },
                { t: "Post-workout", f: "Protein shake + banana or bread", fv: "Milk + yogurt + banana (blended)", fvg: "Oat milk + plant protein + banana", fb: "Milk + banana + egg", k: 320, p: 28, c: 42, fat: 4 },
                { t: "Dinner", f: "Sea bass (150g) + quinoa + vegetables", fv: "Halloumi (120g) + quinoa + vegetables", fvg: "Marinated tofu (150g) + quinoa + roasted vegetables", fb: "Canned mackerel + bulgur (instead of quinoa, cheaper) + salad", k: 520, p: 38, c: 52, fat: 14 },
            ]
        },
        {
            day: "Fri", meals: [
                { t: "Breakfast", f: "Avocado toast (2) + 2 boiled eggs + milk", fv: "Avocado toast + 2 eggs + cheese + milk", fvg: "Avocado toast + hemp seeds + tahini + soy milk", fb: "Egg toast + tahini + milk", k: 570, p: 32, c: 50, fat: 24 },
                { t: "Snack", f: "Yogurt + granola + strawberries", fv: "Greek yogurt + granola + berries + nuts", fvg: "Soy yogurt + granola + berries", fb: "Plain yogurt + homemade granola + banana", k: 300, p: 16, c: 40, fat: 8 },
                { t: "Lunch", f: "Rice (200g) + chicken stir-fry (200g)", fv: "Rice + halloumi stir-fry (150g) + vegetables", fvg: "Rice + tofu stir-fry (200g) + vegetables", fb: "Rice + chicken thigh stir-fry (economical)", k: 700, p: 50, c: 78, fat: 16 },
                { t: "Snack", f: "Cottage cheese + apple", fv: "Cottage cheese + apple + nuts", fvg: "Silken tofu + apple + agave", fb: "Plain cottage cheese + apple", k: 200, p: 16, c: 18, fat: 6 },
                { t: "Dinner", f: "Lamb chops (150g) + bulgur + salad", fv: "Egg-mushroom frittata + bulgur + salad", fvg: "Lentil patties + bulgur + salad", fb: "Ground beef (150g) + bulgur + salad (economical)", k: 580, p: 42, c: 58, fat: 22 },
            ]
        },
        {
            day: "Sat", meals: [
                { t: "Breakfast", f: "Protein waffles (2) + banana + honey", fv: "Egg waffles (high protein) + banana + honey", fvg: "Oat waffles + banana + maple syrup", fb: "Pancakes (flour+egg+milk) + banana + honey", k: 560, p: 36, c: 70, fat: 14 },
                { t: "Snack", f: "Milk + granola + walnuts", fv: "Milk + granola + walnuts + yogurt", fvg: "Oat milk + granola + walnuts", fb: "Milk + homemade granola + sunflower seeds", k: 360, p: 14, c: 46, fat: 16 },
                { t: "Lunch", f: "Ground beef (150g) + pasta + tomato sauce", fv: "Soy mince + pasta + tomato sauce + parmesan", fvg: "Lentil Bolognese + pasta + nutritional yeast", fb: "Ground beef (150g) + pasta + tomato paste sauce", k: 680, p: 44, c: 72, fat: 18 },
                { t: "Snack", f: "Protein bar", fv: "Greek yogurt + nuts + honey", fvg: "Date energy ball + almond butter", fb: "Bread + peanut butter + banana", k: 250, p: 20, c: 28, fat: 8 },
                { t: "Dinner", f: "Chicken (200g) + potatoes (150g) + broccoli", fv: "Halloumi (150g) + potatoes + broccoli", fvg: "Baked tofu (200g) + potatoes + broccoli", fb: "Chicken thigh (200g) + boiled potato + broccoli", k: 620, p: 46, c: 56, fat: 18 },
            ]
        },
        {
            day: "Sun", meals: [
                { t: "Breakfast", f: "Full spread: eggs, cheese, olives, tomato, bread + milk", fv: "Full vegetarian: eggs, cheese, olives, tomato, avocado, bread + milk", fvg: "Vegan full: tofu, tahini, olives, tomato, avocado, bread + plant milk", fb: "Basic full: 2 eggs + cheese + bread + olives + tea (economical)", k: 580, p: 34, c: 60, fat: 24 },
                { t: "Snack", f: "Fruit salad + yogurt", fv: "Fruit salad + Greek yogurt + granola", fvg: "Fruit salad + plant yogurt + hemp seeds", fb: "Seasonal fruit salad + plain yogurt", k: 200, p: 8, c: 34, fat: 4 },
                { t: "Lunch", f: "Lentil soup + whole bread + yogurt", fv: "Lentil soup + whole bread + yogurt + egg", fvg: "Lentil soup (large) + whole bread + tahini", fb: "Lentil soup (very economical) + bread + plain yogurt", k: 450, p: 24, c: 64, fat: 8 },
                { t: "Snack", f: "Protein smoothie", fv: "Milk + Greek yogurt + banana", fvg: "Oat milk + plant protein + banana", fb: "Milk + egg + banana (blended)", k: 300, p: 28, c: 38, fat: 6 },
                { t: "Dinner", f: "Salmon (180g) + rice (180g) + salad", fv: "Grilled halloumi (150g) + rice + salad", fvg: "Marinated tempeh (180g) + rice + salad", fb: "Canned mackerel + rice + tomato salad (economical)", k: 660, p: 46, c: 68, fat: 18 },
            ]
        },
    ],
    maintain: [
        {
            day: "Mon", meals: [
                { t: "Breakfast", f: "2 eggs + oats (50g) + fruit", fv: "2 eggs + oats + fruit + nuts", fvg: "Oats (50g) + plant milk + fruit + chia seeds", fb: "2 eggs + oats + banana (simple and economical)", k: 430, p: 22, c: 52, fat: 14 },
                { t: "Snack", f: "Yogurt + hazelnuts", fv: "Greek yogurt + hazelnuts + honey", fvg: "Soy yogurt + hazelnuts", fb: "Plain yogurt + sunflower seeds", k: 200, p: 10, c: 12, fat: 12 },
                { t: "Lunch", f: "Chicken (150g) + bulgur (150g) + salad", fv: "Grilled halloumi (100g) + bulgur + salad", fvg: "Lentils (150g) + bulgur + salad", fb: "Chicken thigh (150g) + bulgur + tomato salad", k: 560, p: 38, c: 56, fat: 14 },
                { t: "Snack", f: "Fruit + cottage cheese", fv: "Fruit + cottage cheese", fvg: "Fruit + hummus", fb: "Fruit + plain yogurt", k: 180, p: 10, c: 22, fat: 5 },
                { t: "Dinner", f: "Fish (130g) + vegetables + whole wheat bread", fv: "Grilled halloumi (100g) + vegetables + whole wheat bread", fvg: "Chickpea dish + vegetables + whole wheat bread", fb: "Canned fish (130g) + oven vegetables + bread", k: 450, p: 30, c: 42, fat: 14 },
            ]
        },
        {
            day: "Tue", meals: [
                { t: "Breakfast", f: "Whole wheat toast + avocado + boiled egg", fv: "Whole wheat toast + avocado + boiled egg + cheese", fvg: "Whole wheat toast + avocado + hemp seeds", fb: "Toast + tahini + boiled egg (avocado alternative)", k: 420, p: 18, c: 38, fat: 20 },
                { t: "Snack", f: "Apple + almonds", fv: "Apple + almonds", fvg: "Apple + almonds", fb: "Apple + sunflower seeds", k: 185, p: 4, c: 22, fat: 10 },
                { t: "Lunch", f: "Lentil soup + whole bread + tzatziki", fv: "Lentil soup + whole bread + tzatziki + egg", fvg: "Lentil soup + whole bread + tahini", fb: "Lentil soup + bread + ayran (economical and filling)", k: 490, p: 22, c: 66, fat: 10 },
                { t: "Snack", f: "Kefir + dried fruit", fv: "Kefir + dried fruit", fvg: "Soy kefir + dried fruit", fb: "Ayran + raisins", k: 180, p: 6, c: 28, fat: 3 },
                { t: "Dinner", f: "Turkey (150g) + roasted vegetables", fv: "Lentil-mushroom dish + roasted vegetables", fvg: "Chickpea-mushroom dish + roasted vegetables", fb: "Ground turkey (150g) + oven vegetables + salad", k: 430, p: 32, c: 28, fat: 14 },
            ]
        },
        {
            day: "Wed", meals: [
                { t: "Breakfast", f: "Yogurt + granola + fruit", fv: "Greek yogurt + granola + fruit + chia", fvg: "Plant yogurt + granola + fruit", fb: "Plain yogurt + homemade granola + banana", k: 380, p: 14, c: 56, fat: 10 },
                { t: "Snack", f: "Walnuts + cheese", fv: "Walnuts + cheese", fvg: "Walnuts + dates", fb: "Sunflower seeds + cheap cheese", k: 190, p: 8, c: 6, fat: 16 },
                { t: "Lunch", f: "Tuna salad + whole bread", fv: "Egg salad (2 eggs) + whole bread + avocado", fvg: "Chickpea-avocado salad + whole bread", fb: "Canned tuna salad + bread + seasonal salad", k: 480, p: 30, c: 42, fat: 18 },
                { t: "Snack", f: "Milk + banana", fv: "Milk + banana", fvg: "Oat milk + banana", fb: "Milk + banana", k: 200, p: 8, c: 34, fat: 3 },
                { t: "Dinner", f: "Chicken stir-fry + rice (150g) + salad", fv: "Halloumi stir-fry + rice + salad", fvg: "Tofu stir-fry + rice + salad", fb: "Chicken thigh stir-fry + rice + tomato salad", k: 510, p: 36, c: 56, fat: 12 },
            ]
        },
        {
            day: "Thu", meals: [
                { t: "Breakfast", f: "2 egg omelet + vegetables + bread", fv: "2 egg omelet + cheese + vegetables + bread", fvg: "Tofu scramble + vegetables + bread", fb: "2 egg omelet + seasonal vegetables + bread", k: 390, p: 20, c: 38, fat: 16 },
                { t: "Snack", f: "Apple + hazelnuts", fv: "Apple + hazelnuts + yogurt", fvg: "Apple + hazelnuts", fb: "Apple + sunflower seeds", k: 175, p: 4, c: 22, fat: 9 },
                { t: "Lunch", f: "Chickpea dish + yogurt + salad", fv: "Chickpea dish + yogurt + egg + salad", fvg: "Chickpea dish + tahini + salad", fb: "Chickpea dish (dry chickpea, cheap) + plain yogurt + onion", k: 520, p: 20, c: 68, fat: 10 },
                { t: "Snack", f: "Light protein smoothie", fv: "Milk + Greek yogurt + fruit", fvg: "Oat milk + banana + chia", fb: "Milk + banana + oats (blended)", k: 220, p: 14, c: 28, fat: 4 },
                { t: "Dinner", f: "Salmon (130g) + steamed vegetables", fv: "Grilled halloumi (100g) + steamed vegetables", fvg: "Baked tofu (130g) + steamed vegetables + tahini", fb: "Canned mackerel (130g) + steamed vegetables", k: 440, p: 32, c: 20, fat: 22 },
            ]
        },
        {
            day: "Fri", meals: [
                { t: "Breakfast", f: "Muesli + milk + fruit", fv: "Muesli + milk + fruit + yogurt", fvg: "Muesli + oat milk + fruit", fb: "Homemade muesli + milk + banana", k: 410, p: 14, c: 62, fat: 10 },
                { t: "Snack", f: "Yogurt + honey", fv: "Greek yogurt + honey + nuts", fvg: "Plant yogurt + agave", fb: "Plain yogurt + honey", k: 160, p: 8, c: 22, fat: 4 },
                { t: "Lunch", f: "Wrap: chicken + salad + yogurt sauce", fv: "Wrap: egg + avocado + salad + yogurt sauce", fvg: "Wrap: hummus + avocado + salad", fb: "Wrap: canned tuna + salad + yogurt sauce", k: 530, p: 30, c: 52, fat: 16 },
                { t: "Snack", f: "Fruit + cottage cheese", fv: "Fruit + cottage cheese", fvg: "Fruit + hummus", fb: "Fruit + plain yogurt", k: 150, p: 8, c: 18, fat: 4 },
                { t: "Dinner", f: "Fish (130g) + potatoes (100g) + salad", fv: "Halloumi (100g) + potatoes + salad", fvg: "Chickpea-potato dish + salad", fb: "Canned fish + boiled potatoes + salad", k: 480, p: 30, c: 46, fat: 16 },
            ]
        },
        {
            day: "Sat", meals: [
                { t: "Breakfast", f: "Avocado toast + egg + milk", fv: "Avocado toast + egg + cheese + milk", fvg: "Avocado toast + hemp seeds + soy milk", fb: "Egg toast + tahini + milk", k: 430, p: 20, c: 42, fat: 20 },
                { t: "Snack", f: "Kefir + granola", fv: "Kefir + granola + fruit", fvg: "Soy kefir + granola", fb: "Ayran + homemade granola", k: 220, p: 8, c: 32, fat: 6 },
                { t: "Lunch", f: "Homemade meatballs (3) + bulgur + tzatziki", fv: "Mushroom balls (5) + bulgur + tzatziki", fvg: "Lentil balls (5) + bulgur + tahini sauce", fb: "Cheap meatballs + bulgur + plain yogurt", k: 560, p: 30, c: 58, fat: 18 },
                { t: "Snack", f: "Fruit salad", fv: "Fruit salad + yogurt", fvg: "Fruit salad + chia seeds", fb: "Seasonal fruit salad", k: 130, p: 2, c: 28, fat: 1 },
                { t: "Dinner", f: "Turkey (130g) + pasta (70g) + salad", fv: "Soy mince + pasta + salad", fvg: "Lentil sauce + pasta + salad", fb: "Ground beef (130g) + pasta + tomato salad", k: 490, p: 34, c: 52, fat: 14 },
            ]
        },
        {
            day: "Sun", meals: [
                { t: "Breakfast", f: "Weekend brunch (light portion): eggs + cheese + vegetables", fv: "Weekend brunch: eggs + cheese + avocado + vegetables", fvg: "Weekend brunch: tofu + tahini + vegetables + whole bread", fb: "Simple weekend: 2 eggs + cheese + tomato + bread", k: 480, p: 26, c: 44, fat: 20 },
                { t: "Snack", f: "Yogurt + fruit", fv: "Greek yogurt + fruit + granola", fvg: "Plant yogurt + fruit", fb: "Plain yogurt + fruit", k: 160, p: 8, c: 22, fat: 4 },
                { t: "Lunch", f: "Lentil patties + ayran + salad", fv: "Lentil patties + ayran + egg + salad", fvg: "Lentil patties + tahini + salad", fb: "Lentil patties + ayran + onion salad (cheap)", k: 430, p: 20, c: 56, fat: 10 },
                { t: "Snack", f: "Cheese + whole bread", fv: "Cheese + whole bread + tomato", fvg: "Hummus + whole bread", fb: "Cheap cheese + bread", k: 180, p: 10, c: 18, fat: 8 },
                { t: "Dinner", f: "Fish soup + whole bread", fv: "Egg-vegetable soup + whole bread", fvg: "Thick vegetable soup + whole bread + tahini", fb: "Lentil soup + bread (very economical)", k: 400, p: 24, c: 44, fat: 12 },
            ]
        },
    ],
};

// ─── EXERCISE PROGRAMS ────────────────────────────────────────────────────────
const exercisePlans = {
    lose: {
        tips: [
            "Create a calorie deficit of 300–500 kcal per day. Don't cut too much — muscle mass will be lost.",
            "Do cardio 3–5 days a week combined with strength training. Muscle burns more calories at rest.",
            "NEAT (Non-exercise activity thermogenesis): Take the stairs, walk, do housework. Small movements add up.",
            "Sleep 7–9 hours — lack of sleep increases cortisol and triggers cravings.",
        ],
        weekly: [
            {
                day: "Mon", emoji: "🏋️", focus: "Upper Body + Core", exercises: [
                    { name: "Bench Press / Push-up", sets: "3×12", rest: "60s", note: "Beginners: knee push-up" },
                    { name: "Dumbbell Row", sets: "3×12", rest: "60s", note: "Or resistance band" },
                    { name: "Shoulder Press", sets: "3×10", rest: "60s", note: "Can use water bottles at home" },
                    { name: "Plank", sets: "3×40s", rest: "45s", note: "Keep core tight" },
                    { name: "Bicycle Crunch", sets: "3×20", rest: "45s", note: "Slow and controlled" },
                ]
            },
            {
                day: "Tue", emoji: "🏃", focus: "Cardio + Active Recovery", exercises: [
                    { name: "Brisk Walking / Light Jog", sets: "35 min", rest: "—", note: "70% max heart rate" },
                    { name: "Jump Rope", sets: "3×2 min", rest: "60s", note: "Beginners: slow pace" },
                    { name: "Stretching", sets: "15 min", rest: "—", note: "All major muscles" },
                ]
            },
            {
                day: "Wed", emoji: "🦵", focus: "Lower Body + Glutes", exercises: [
                    { name: "Squat", sets: "4×15", rest: "60s", note: "Bodyweight → dumbbell progress" },
                    { name: "Deadlift / Romanian Deadlift", sets: "3×12", rest: "90s", note: "Form is most important" },
                    { name: "Reverse Lunge", sets: "3×10/leg", rest: "60s", note: "Balance and coordination" },
                    { name: "Calf Raise", sets: "3×20", rest: "45s", note: "Can do on a step" },
                    { name: "Glute Bridge", sets: "3×15", rest: "45s", note: "Squeeze at the top" },
                ]
            },
            {
                day: "Thu", emoji: "🧘", focus: "Rest / Yoga / Walking", exercises: [
                    { name: "30 Min Walk", sets: "1×30 min", rest: "—", note: "No pressure, relax" },
                    { name: "Yoga / Mobility", sets: "20 min", rest: "—", note: "YouTube: Yoga with Adriene" },
                    { name: "Deep Breathing", sets: "5 min", rest: "—", note: "4-7-8 breathing technique" },
                ]
            },
            {
                day: "Fri", emoji: "🏋️", focus: "Full Body + HIIT", exercises: [
                    { name: "Burpee", sets: "4×10", rest: "45s", note: "No jump for beginners" },
                    { name: "Dumbbell Squat to Press", sets: "3×12", rest: "60s", note: "Full body movement" },
                    { name: "Mountain Climber", sets: "3×30s", rest: "45s", note: "Fast tempo" },
                    { name: "Kettlebell Swing / Hip Hinge", sets: "3×15", rest: "60s", note: "Great fat burner" },
                ]
            },
            {
                day: "Sat", emoji: "🚴", focus: "Cardio (Fun)", exercises: [
                    { name: "Cycling / Swimming / Dancing", sets: "45–60 min", rest: "—", note: "Enjoy it, it shouldn't feel like work" },
                    { name: "Core Circuit", sets: "2 rounds", rest: "30s", note: "Plank, side plank, dead bug" },
                ]
            },
            {
                day: "Sun", emoji: "😴", focus: "Complete Rest", exercises: [
                    { name: "Active Rest", sets: "—", rest: "—", note: "Light walk, gentle stretching only" },
                    { name: "Prepare for Next Week", sets: "—", rest: "—", note: "Plan meals, sleep well" },
                ]
            },
        ],
    },
    gain: {
        tips: [
            "Progressive overload is the #1 rule: increase weight, reps, or sets each week.",
            "Eat 300–500 kcal surplus. Too much leads to fat gain — grow slowly.",
            "Prioritize compound movements: squats, deadlifts, bench press, rows.",
            "Post-workout: eat protein + carbs within 30–60 minutes. Muscle synthesis starts now.",
        ],
        weekly: [
            {
                day: "Mon", emoji: "💪", focus: "Push (Chest / Shoulder / Triceps)", exercises: [
                    { name: "Bench Press", sets: "4×8", rest: "90s", note: "Increase weight each week" },
                    { name: "Incline Dumbbell Press", sets: "3×10", rest: "75s", note: "Upper chest focus" },
                    { name: "Lateral Raise", sets: "3×12", rest: "60s", note: "Slow and controlled" },
                    { name: "Tricep Dips / Pushdown", sets: "3×12", rest: "60s", note: "Fully extend elbows" },
                    { name: "Overhead Press", sets: "3×8", rest: "90s", note: "Core braced" },
                ]
            },
            {
                day: "Tue", emoji: "🔙", focus: "Pull (Back / Biceps)", exercises: [
                    { name: "Deadlift", sets: "4×6", rest: "120s", note: "King of compound movements" },
                    { name: "Pull-up / Lat Pulldown", sets: "3×8", rest: "90s", note: "Wide grip" },
                    { name: "Barbell / Dumbbell Row", sets: "3×10", rest: "75s", note: "Chest to bench" },
                    { name: "Face Pull", sets: "3×15", rest: "60s", note: "Rear delt health" },
                    { name: "Bicep Curl", sets: "3×12", rest: "60s", note: "Supinate wrist at top" },
                ]
            },
            {
                day: "Wed", emoji: "🦵", focus: "Legs (Quad / Hamstring / Glutes)", exercises: [
                    { name: "Squat", sets: "4×8", rest: "120s", note: "Below parallel is ideal" },
                    { name: "Romanian Deadlift", sets: "3×10", rest: "90s", note: "Hip hinge, not back bend" },
                    { name: "Leg Press", sets: "3×12", rest: "75s", note: "Vary foot position" },
                    { name: "Leg Curl / Nordic Curl", sets: "3×10", rest: "60s", note: "Hamstring protection" },
                    { name: "Calf Raise", sets: "4×15", rest: "45s", note: "Full range of motion" },
                ]
            },
            {
                day: "Thu", emoji: "🧘", focus: "Rest + Mobility", exercises: [
                    { name: "Light Walk", sets: "20–30 min", rest: "—", note: "Improves blood flow and recovery" },
                    { name: "Foam Rolling", sets: "10–15 min", rest: "—", note: "Legs, back, lats" },
                    { name: "Active Stretching", sets: "15 min", rest: "—", note: "Focus on worked muscles" },
                ]
            },
            {
                day: "Fri", emoji: "💪", focus: "Push + Core", exercises: [
                    { name: "Dumbbell Bench Press", sets: "4×10", rest: "75s", note: "Different stimulus than barbell" },
                    { name: "Arnold Press", sets: "3×10", rest: "75s", note: "All 3 shoulder heads" },
                    { name: "Cable Fly / Dumbbell Fly", sets: "3×12", rest: "60s", note: "Chest stretch at bottom" },
                    { name: "Weighted Plank", sets: "3×30s", rest: "45s", note: "Core for lifting strength" },
                    { name: "Ab Wheel / Rollout", sets: "3×10", rest: "60s", note: "Advanced: full rollout" },
                ]
            },
            {
                day: "Sat", emoji: "🔙", focus: "Pull + Biceps", exercises: [
                    { name: "Weighted Pull-up", sets: "4×6", rest: "90s", note: "Add belt weight if easy" },
                    { name: "Seated Cable Row", sets: "3×10", rest: "75s", note: "Squeeze at end" },
                    { name: "Single-arm Row", sets: "3×10", rest: "60s", note: "Full range of motion" },
                    { name: "Hammer Curl", sets: "3×12", rest: "60s", note: "Brachialis focus" },
                ]
            },
            {
                day: "Sun", emoji: "😴", focus: "Complete Rest", exercises: [
                    { name: "Rest", sets: "—", rest: "—", note: "MUSCLES GROW DURING REST. Sleep 8+ hours." },
                ]
            },
        ],
    },
    muscle: {
        tips: [
            "Mind-muscle connection: focus on feeling the muscle work, not just lifting weight.",
            "Train each muscle group 2x/week for maximum hypertrophy stimulus.",
            "Protein target: 1.8–2.2g per kg bodyweight. Distribute evenly across meals.",
            "Vary tempo: 3 seconds eccentric, 1 second pause, 1 second concentric for more TUT.",
        ],
        weekly: [
            {
                day: "Mon", emoji: "💪", focus: "Chest + Triceps (Heavy)", exercises: [
                    { name: "Barbell Bench Press", sets: "5×5", rest: "120s", note: "Max strength focus" },
                    { name: "Incline DB Press", sets: "4×8–10", rest: "90s", note: "Upper chest hypertrophy" },
                    { name: "Cable Crossover", sets: "3×15", rest: "60s", note: "Peak contraction squeeze" },
                    { name: "Skull Crusher", sets: "3×12", rest: "60s", note: "Slow eccentric" },
                    { name: "Tricep Pushdown", sets: "3×15", rest: "45s", note: "Keep elbows in" },
                ]
            },
            {
                day: "Tue", emoji: "🔙", focus: "Back + Biceps (Volume)", exercises: [
                    { name: "Weighted Pull-up", sets: "4×8", rest: "90s", note: "Full hang to chin above bar" },
                    { name: "Barbell Row", sets: "4×10", rest: "75s", note: "Overhand grip" },
                    { name: "Cable Row", sets: "3×12", rest: "60s", note: "Underhand for lower lat" },
                    { name: "Straight-arm Pulldown", sets: "3×15", rest: "60s", note: "Lat isolation" },
                    { name: "Incline DB Curl", sets: "3×12", rest: "60s", note: "Full stretch" },
                    { name: "Concentration Curl", sets: "3×12", rest: "45s", note: "Mind-muscle peak" },
                ]
            },
            {
                day: "Wed", emoji: "🦵", focus: "Quads + Glutes (Volume)", exercises: [
                    { name: "Back Squat", sets: "4×10", rest: "90s", note: "Full depth" },
                    { name: "Hack Squat / Leg Press", sets: "4×12", rest: "75s", note: "High foot position for glutes" },
                    { name: "Walking Lunge", sets: "3×12/leg", rest: "60s", note: "Dumbbells for resistance" },
                    { name: "Leg Extension", sets: "3×15", rest: "45s", note: "Quad isolation" },
                    { name: "Hip Thrust", sets: "4×12", rest: "60s", note: "Glute king exercise" },
                ]
            },
            {
                day: "Thu", emoji: "🎯", focus: "Shoulders + Traps (Isolation)", exercises: [
                    { name: "Seated DB Press", sets: "4×10", rest: "75s", note: "All 3 deltoid heads" },
                    { name: "Lateral Raise (Cable)", sets: "4×15", rest: "45s", note: "Cable for constant tension" },
                    { name: "Front Raise", sets: "3×12", rest: "45s", note: "Alternate arms" },
                    { name: "Rear Delt Fly", sets: "3×15", rest: "45s", note: "Bent over position" },
                    { name: "Barbell Shrug", sets: "4×12", rest: "60s", note: "Hold at top 1–2s" },
                ]
            },
            {
                day: "Fri", emoji: "💪", focus: "Chest + Triceps (Volume)", exercises: [
                    { name: "Dumbbell Press", sets: "4×12", rest: "75s", note: "Full range of motion" },
                    { name: "Push-up Variations", sets: "3×failure", rest: "60s", note: "Wide, close, decline" },
                    { name: "Pec Deck / Cable Fly", sets: "3×15", rest: "60s", note: "Squeeze at peak" },
                    { name: "Overhead Tricep Extension", sets: "3×12", rest: "60s", note: "Long head stretch" },
                    { name: "Diamond Push-up", sets: "3×12", rest: "45s", note: "Tricep burnout" },
                ]
            },
            {
                day: "Sat", emoji: "🦵", focus: "Hamstrings + Calves + Core", exercises: [
                    { name: "Romanian Deadlift", sets: "4×10", rest: "90s", note: "Feel hamstring stretch" },
                    { name: "Lying Leg Curl", sets: "3×12", rest: "60s", note: "Slow eccentric 3–4s" },
                    { name: "Seated Calf Raise", sets: "4×20", rest: "45s", note: "Full range: stretch to peak" },
                    { name: "Standing Calf Raise", sets: "3×15", rest: "45s", note: "Toes in/out variation" },
                    { name: "Hanging Leg Raise", sets: "3×12", rest: "60s", note: "Control the swing" },
                    { name: "Cable Crunch", sets: "3×20", rest: "45s", note: "Exhale at contraction" },
                ]
            },
            {
                day: "Sun", emoji: "😴", focus: "Rest + Mobility", exercises: [
                    { name: "Light Cardio", sets: "20 min", rest: "—", note: "Walk or bike, low intensity" },
                    { name: "Full Body Stretch", sets: "20 min", rest: "—", note: "Hold each 30+ seconds" },
                    { name: "Sleep", sets: "8+ hours", rest: "—", note: "Growth hormone peaks during deep sleep" },
                ]
            },
        ],
    },
    maintain: {
        tips: [
            "Consistency is everything. Train 3–4 days/week, every week, for years.",
            "Combine cardio and strength training. Neither alone is enough.",
            "Listen to your body: deload every 6–8 weeks to prevent burnout.",
            "Track workouts: you can't improve what you don't measure.",
        ],
        weekly: [
            {
                day: "Mon", emoji: "💪", focus: "Full Body Strength", exercises: [
                    { name: "Squat or Leg Press", sets: "3×10", rest: "90s", note: "Lower body base" },
                    { name: "Bench Press or Push-up", sets: "3×10", rest: "75s", note: "Push movement" },
                    { name: "Row or Pull-up", sets: "3×10", rest: "75s", note: "Pull movement" },
                    { name: "Shoulder Press", sets: "3×10", rest: "60s", note: "Overhead strength" },
                    { name: "Plank", sets: "3×30–45s", rest: "45s", note: "Core stability" },
                ]
            },
            {
                day: "Tue", emoji: "🏃", focus: "Cardio + Flexibility", exercises: [
                    { name: "30 Min Run / Cycle / Swim", sets: "1×30 min", rest: "—", note: "Zone 2 pace (can hold conversation)" },
                    { name: "Dynamic Stretching", sets: "10 min", rest: "—", note: "Before cardio" },
                    { name: "Static Stretching", sets: "10 min", rest: "—", note: "After cardio" },
                ]
            },
            {
                day: "Wed", emoji: "🧘", focus: "Rest / Yoga", exercises: [
                    { name: "Yoga or Pilates", sets: "30 min", rest: "—", note: "Posture and mobility" },
                    { name: "Walking", sets: "20 min", rest: "—", note: "Active recovery" },
                ]
            },
            {
                day: "Thu", emoji: "💪", focus: "Full Body + Core", exercises: [
                    { name: "Deadlift or Hip Hinge", sets: "3×10", rest: "90s", note: "Posterior chain" },
                    { name: "Lunge", sets: "3×10/leg", rest: "60s", note: "Balance and stability" },
                    { name: "Dumbbell Row", sets: "3×12", rest: "60s", note: "Back and biceps" },
                    { name: "Cable/Band Pull-apart", sets: "3×15", rest: "45s", note: "Rear delts and posture" },
                    { name: "Ab Circuit", sets: "2 rounds", rest: "30s", note: "Crunch, plank, side plank" },
                ]
            },
            {
                day: "Fri", emoji: "🏃", focus: "HIIT or Sport", exercises: [
                    { name: "20 Min HIIT", sets: "1×20 min", rest: "—", note: "30s work / 30s rest format" },
                    { name: "Sport of Choice", sets: "30–45 min", rest: "—", note: "Football, tennis, basketball — fun!" },
                ]
            },
            {
                day: "Sat", emoji: "🚶", focus: "Active Fun", exercises: [
                    { name: "Hike / Bike Ride / Swim", sets: "45–60 min", rest: "—", note: "Social and enjoyable" },
                    { name: "Light Stretching", sets: "10 min", rest: "—", note: "Maintain flexibility" },
                ]
            },
            {
                day: "Sun", emoji: "😴", focus: "Complete Rest", exercises: [
                    { name: "Rest", sets: "—", rest: "—", note: "Prepare for the week ahead. Sleep well." },
                ]
            },
        ],
    },
};

// ─── FIELD COMPONENT ─────────────────────────────────────────────────────────
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

// ─── DIET PLAN SECTION ────────────────────────────────────────────────────────
function DietPlanSection({ data, targets, goalCal }) {
    const [activeDay, setActiveDay] = useState(0);
    const [dietMode, setDietMode] = useState(
        data.diet === "vegan" ? "vegan" : data.diet === "vegetarian" ? "vegetarian" : "normal"
    );
    const [showBudget, setShowBudget] = useState(false);
    const [exerciseDay, setExerciseDay] = useState(0);
    const [activeSection, setActiveSection] = useState("diet");

    const plan = weeklyPlans[data.goal] || weeklyPlans.maintain;
    const exPlan = exercisePlans[data.goal] || exercisePlans.maintain;
    const dayData = plan[activeDay];
    const dayTotal = dayData.meals.reduce((a, m) => a + m.k, 0);
    const exDayData = exPlan.weekly[exerciseDay];

    const goalLabels = {
        lose: "🔥 Weight Loss",
        gain: "💪 Weight Gain",
        muscle: "🏋️ Muscle Building",
        maintain: "⚖️ Maintenance"
    };

    const getFoodText = (meal) => {
        if (showBudget) return meal.fb;
        if (dietMode === "vegan") return meal.fvg;
        if (dietMode === "vegetarian") return meal.fv;
        return meal.f;
    };

    const mealTimeColors = {
        "Breakfast": "#f59e0b",
        "Snack": "#10b981",
        "Lunch": "#3b82f6",
        "Dinner": "#8b5cf6",
        "Post-workout": "#ef4444",
        "Pre-workout": "#f97316",
    };

    return (
        <div className="diet-plan-section">
            {/* Header */}
            <div className="diet-plan-header">
                <div className="diet-plan-badge">{goalLabels[data.goal] || "Personalized"} Plan</div>
                <h2 className="diet-plan-title">Hi {data.name || "there"}! Your Personalized Plan 👋</h2>
                <p className="diet-plan-subtitle">Based on your profile: {data.age} years old · {data.weight}kg · {data.height}cm</p>
            </div>

            {/* Section Tabs */}
            <div className="section-tabs">
                <button className={`section-tab${activeSection === "diet" ? " section-tab--active" : ""}`} onClick={() => setActiveSection("diet")}>
                    🥗 Diet Program
                </button>
                <button className={`section-tab${activeSection === "exercise" ? " section-tab--active" : ""}`} onClick={() => setActiveSection("exercise")}>
                    🏋️ Exercise Program
                </button>
                <button className={`section-tab${activeSection === "targets" ? " section-tab--active" : ""}`} onClick={() => setActiveSection("targets")}>
                    📊 Daily Targets
                </button>
            </div>

            {/* DIET SECTION */}
            {activeSection === "diet" && (
                <>
                    {/* Diet Mode Switcher */}
                    <div className="diet-mode-bar">
                        <span className="diet-mode-label">Diet Type:</span>
                        <div className="diet-mode-pills">
                            {[["normal", "🍖 Regular"], ["vegetarian", "🥦 Vegetarian"], ["vegan", "🌱 Vegan"]].map(([v, l]) => (
                                <button key={v} className={`diet-pill${dietMode === v ? " diet-pill--active" : ""}`} onClick={() => setDietMode(v)}>{l}</button>
                            ))}
                        </div>
                        <button className={`budget-toggle${showBudget ? " budget-toggle--active" : ""}`} onClick={() => setShowBudget(b => !b)}>
                            {showBudget ? "✅ Budget Mode ON" : "💰 Budget Mode"}
                        </button>
                    </div>

                    {showBudget && (
                        <div className="budget-banner">
                            💡 <strong>Budget Mode:</strong> Showing economical alternatives with the same nutritional value. Saves 40–60% cost!
                        </div>
                    )}

                    {/* Day Tabs */}
                    <div className="weekly-plan">
                        <h3 className="section-title">Weekly Meal Plan</h3>
                        <div className="day-tabs">
                            {plan.map((d, i) => (
                                <button key={i} className={`day-btn${activeDay === i ? " day-btn--active" : ""}`} onClick={() => setActiveDay(i)}>
                                    {d.day}
                                </button>
                            ))}
                        </div>

                        <div className="meal-list">
                            {dayData.meals.map((m, i) => (
                                <div className="meal-row-card" key={i}>
                                    <div className="meal-row-left">
                                        <span className="meal-time-badge" style={{ background: (mealTimeColors[m.t] || "#6b7280") + "22", color: mealTimeColors[m.t] || "#6b7280", border: `1px solid ${(mealTimeColors[m.t] || "#6b7280")}44` }}>
                                            {m.t}
                                        </span>
                                        <span className="meal-food-text">{getFoodText(m)}</span>
                                    </div>
                                    <div className="meal-row-macros">
                                        <span className="macro-chip macro-kcal">{m.k} kcal</span>
                                        <span className="macro-chip macro-p">P: {m.p}g</span>
                                        <span className="macro-chip macro-c">C: {m.c}g</span>
                                        <span className="macro-chip macro-f">F: {m.fat}g</span>
                                    </div>
                                </div>
                            ))}
                            <div className="meal-total-row">
                                <span>📊 Daily Total</span>
                                <div className="meal-total-macros">
                                    <strong>{dayTotal} kcal</strong>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Target: {Math.round(goalCal)} kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Tips */}
                    <div className="nutrition-tips">
                        <h3 className="section-title">🥤 Hydration & Nutrition Tips</h3>
                        <div className="tips-grid">
                            <div className="tip-card">
                                <div className="tip-icon">💧</div>
                                <div className="tip-content">
                                    <strong>Daily Water</strong>
                                    <span>{targets.water} ml ({Math.round(targets.water / 250)} glasses)</span>
                                </div>
                            </div>
                            <div className="tip-card">
                                <div className="tip-icon">⏰</div>
                                <div className="tip-content">
                                    <strong>Meal Timing</strong>
                                    <span>Every 3–4 hours. Don't skip breakfast!</span>
                                </div>
                            </div>
                            <div className="tip-card">
                                <div className="tip-icon">🥩</div>
                                <div className="tip-content">
                                    <strong>Protein Priority</strong>
                                    <span>{targets.protein}g/day — include in every meal</span>
                                </div>
                            </div>
                            <div className="tip-card">
                                <div className="tip-icon">🌙</div>
                                <div className="tip-content">
                                    <strong>Last Meal</strong>
                                    <span>2–3 hours before bed. Light and protein-rich.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* EXERCISE SECTION */}
            {activeSection === "exercise" && (
                <div className="exercise-section">
                    <div className="exercise-tips-banner">
                        <h3>💡 Key Principles for Your Goal</h3>
                        <ul>
                            {exPlan.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </div>

                    <h3 className="section-title">Weekly Exercise Program</h3>
                    <div className="ex-day-tabs">
                        {exPlan.weekly.map((d, i) => (
                            <button key={i} className={`ex-day-btn${exerciseDay === i ? " ex-day-btn--active" : ""}`} onClick={() => setExerciseDay(i)}>
                                <span className="ex-day-emoji">{d.emoji}</span>
                                <span className="ex-day-name">{d.day}</span>
                            </button>
                        ))}
                    </div>

                    <div className="ex-day-card">
                        <div className="ex-day-header">
                            <span className="ex-day-big-emoji">{exDayData.emoji}</span>
                            <div>
                                <div className="ex-day-focus">{exDayData.focus}</div>
                                <div className="ex-exercise-count">{exDayData.exercises.length} exercises</div>
                            </div>
                        </div>

                        <div className="ex-exercise-list">
                            {exDayData.exercises.map((ex, i) => (
                                <div className="ex-exercise-row" key={i}>
                                    <div className="ex-exercise-num">{i + 1}</div>
                                    <div className="ex-exercise-info">
                                        <div className="ex-exercise-name">{ex.name}</div>
                                        <div className="ex-exercise-note">💬 {ex.note}</div>
                                    </div>
                                    <div className="ex-exercise-meta">
                                        <span className="ex-sets">{ex.sets}</span>
                                        {ex.rest !== "—" && <span className="ex-rest">Rest: {ex.rest}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="exercise-extra-tips">
                        <h3 className="section-title">🔑 General Exercise Tips</h3>
                        <div className="ex-tips-grid">
                            {[
                                { icon: "🔥", title: "Warm Up", desc: "5–10 min light cardio + dynamic stretching before every session." },
                                { icon: "❄️", title: "Cool Down", desc: "5–10 min stretching after every workout. Reduces soreness." },
                                { icon: "📈", title: "Track Progress", desc: "Write down weights and reps. Improvement only happens when you measure." },
                                { icon: "💤", title: "Rest is Growth", desc: "Muscles grow during recovery. Never skip rest days!" },
                                { icon: "🍗", title: "Post-workout Meal", desc: "Eat protein + carbs within 60 min after training for best results." },
                                { icon: "🧠", title: "Mind-Muscle", desc: "Focus on the muscle you're working. Quality beats quantity every time." },
                            ].map((t, i) => (
                                <div className="ex-tip-card" key={i}>
                                    <div className="ex-tip-icon">{t.icon}</div>
                                    <div>
                                        <strong>{t.title}</strong>
                                        <p>{t.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TARGETS SECTION */}
            {activeSection === "targets" && (
                <div className="targets-section">
                    <h3 className="section-title">📊 Your Daily Nutrition Targets</h3>
                    <div className="daily-targets">
                        {[
                            { label: "Calories", val: Math.round(goalCal), unit: "kcal", color: "#f59e0b", icon: "🔥" },
                            { label: "Protein", val: targets.protein, unit: "g", color: "#ef4444", icon: "🥩" },
                            { label: "Carbohydrates", val: targets.carb, unit: "g", color: "#3b82f6", icon: "🍞" },
                            { label: "Fat", val: targets.fat, unit: "g", color: "#10b981", icon: "🥑" },
                            { label: "Water", val: targets.water, unit: "ml", color: "#06b6d4", icon: "💧" },
                        ].map(t => (
                            <div className="target-card-v2" key={t.label} style={{ "--tcolor": t.color }}>
                                <div className="target-card-icon">{t.icon}</div>
                                <div className="target-card-val">{t.val}<span className="target-card-unit">{t.unit}</span></div>
                                <div className="target-card-label">{t.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="macro-breakdown">
                        <h3 className="section-title">🍽️ Macronutrient Breakdown</h3>
                        <div className="macro-bar-container">
                            {[
                                { label: "Protein", pct: 30, color: "#ef4444" },
                                { label: "Carbs", pct: 40, color: "#3b82f6" },
                                { label: "Fat", pct: 30, color: "#10b981" },
                            ].map(m => (
                                <div className="macro-bar-row" key={m.label}>
                                    <span className="macro-bar-label">{m.label}</span>
                                    <div className="macro-bar-track">
                                        <div className="macro-bar-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                                    </div>
                                    <span className="macro-bar-pct">{m.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bmi-section">
                        <h3 className="section-title">📏 Your BMI & Stats</h3>
                        {(() => {
                            const bmi = +data.weight / ((+data.height / 100) ** 2);
                            const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
                            const bmiColor = bmi < 18.5 ? "#3b82f6" : bmi < 25 ? "#10b981" : bmi < 30 ? "#f59e0b" : "#ef4444";
                            const tdeeVal = calcTDEE(data);
                            return (
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-label">BMI</div>
                                        <div className="stat-val" style={{ color: bmiColor }}>{bmi.toFixed(1)}</div>
                                        <div className="stat-sub" style={{ color: bmiColor }}>{bmiLabel}</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">TDEE (Maintenance)</div>
                                        <div className="stat-val">{tdeeVal}</div>
                                        <div className="stat-sub">kcal/day</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Goal Calories</div>
                                        <div className="stat-val">{Math.round(goalCal)}</div>
                                        <div className="stat-sub">kcal/day</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Daily Water</div>
                                        <div className="stat-val">{targets.water}</div>
                                        <div className="stat-sub">ml/day</div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── FOOD LOG SECTION ─────────────────────────────────────────────────────────
function FoodLogSection({ data, update, errors }) {
    const meals = data.meals_log || [emptyMeal()];
    const setMeals = (newMeals) => update("meals_log", newMeals);
    const updateMeal = (i, key, val) => {
        const updated = meals.map((m, idx) => (idx === i ? { ...m, [key]: val } : m));
        setMeals(updated);
    };
    const addMeal = () => setMeals([...meals, emptyMeal()]);
    const removeMeal = (i) => setMeals(meals.filter((_, idx) => idx !== i));

    const totals = meals.reduce((acc, m) => ({
        kcal: acc.kcal + (parseFloat(m.kcal) || 0),
        protein: acc.protein + (parseFloat(m.protein) || 0),
        carb: acc.carb + (parseFloat(m.carb) || 0),
        fat: acc.fat + (parseFloat(m.fat) || 0),
    }), { kcal: 0, protein: 0, carb: 0, fat: 0 });

    return (
        <div className="food-log-section">
            <div className="food-log-header">
                <h2 className="food-log-title">📝 What Did You Eat Today?</h2>
                <p className="food-log-subtitle">Log your meals to track your progress. Values can be approximate.</p>
            </div>

            {/* Live Totals */}
            <div className="live-totals">
                <div className="live-total-chip"><span>{Math.round(totals.kcal)}</span><small>kcal</small></div>
                <div className="live-total-chip"><span>{Math.round(totals.protein)}g</span><small>protein</small></div>
                <div className="live-total-chip"><span>{Math.round(totals.carb)}g</span><small>carbs</small></div>
                <div className="live-total-chip"><span>{Math.round(totals.fat)}g</span><small>fat</small></div>
            </div>

            <div className="hc-meal-list">
                {meals.map((meal, i) => (
                    <div className="hc-meal-card" key={i}>
                        <div className="hc-meal-header">
                            <span className="hc-meal-num">🍽️ Meal {i + 1}</span>
                            {meals.length > 1 && (
                                <button type="button" className="hc-meal-remove" onClick={() => removeMeal(i)}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <Field label="Meal Name (optional)">
                            <input type="text" placeholder="e.g. Chicken breast + rice" value={meal.name} onChange={(e) => updateMeal(i, "name", e.target.value)} />
                        </Field>
                        <div className="hc-field-row hc-field-row--4">
                            <Field label="Calories (kcal)" error={errors[`meal_${i}_kcal`]}>
                                <input type="number" placeholder="450" min="0" value={meal.kcal} onChange={(e) => updateMeal(i, "kcal", e.target.value)} />
                            </Field>
                            <Field label="Protein (g)">
                                <input type="number" placeholder="30" min="0" value={meal.protein} onChange={(e) => updateMeal(i, "protein", e.target.value)} />
                            </Field>
                            <Field label="Carbs (g)">
                                <input type="number" placeholder="55" min="0" value={meal.carb} onChange={(e) => updateMeal(i, "carb", e.target.value)} />
                            </Field>
                            <Field label="Fat (g)">
                                <input type="number" placeholder="12" min="0" value={meal.fat} onChange={(e) => updateMeal(i, "fat", e.target.value)} />
                            </Field>
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" className="hc-btn-add-meal" onClick={addMeal}>+ Add Meal</button>

            <Field label="💧 Water Intake (ml)" error={errors.water}>
                <input type="number" placeholder="2000" min="0" value={data.water || ""} onChange={(e) => update("water", e.target.value)} />
            </Field>
        </div>
    );
}

// ─── MAIN MEALS PAGE ──────────────────────────────────────────────────────────
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
        kcal: Math.round(goalCal),
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

    const handleResult = () => {
        if (validate()) {
            sessionStorage.setItem("calcData", JSON.stringify(calcData));
            navigate("/result");
        }
    };

    return (
        <main className="meals-page">
            <div className="meals-container">
                <div className="meals-card">
                    <div className="view-tabs">
                        <button className={`view-tab${activeView === "plan" ? " view-tab--active" : ""}`} onClick={() => setActiveView("plan")}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                            Diet & Exercise Plan
                        </button>
                        <button className={`view-tab${activeView === "log" ? " view-tab--active" : ""}`} onClick={() => setActiveView("log")}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
                        <button className="hc-btn-back" onClick={() => navigate("/calculator")}>Back</button>
                        {activeView === "plan" ? (
                            <button className="hc-btn-next" onClick={() => setActiveView("log")}>
                                Log Your Food →
                            </button>
                        ) : (
                            <button className="hc-btn-next" onClick={handleResult}>
                                See Results ✓
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}