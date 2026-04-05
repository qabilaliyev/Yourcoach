import { useState } from "react";
import "../Style/PlanDashboard.css";
// ─── Hesaplama fonksiyonları ───────────────────────────────────────────────
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
    if (r < 0.85) return { label: "Az", cls: "status-low", diff: Math.round(target - actual), dir: "eksik" };
    if (r > 1.15) return { label: "Fazla", cls: "status-high", diff: Math.round(actual - target), dir: "fazla" };
    return { label: "Normal", cls: "status-ok", diff: 0, dir: "" };
}

// ─── Haftalık plan verileri ───────────────────────────────────────────────
const weeklyPlans = {
    lose: [
        {
            day: "Pzt", meals: [
                { t: "Kahvaltı", f: "2 yumurta haşlama + 1 dilim tam buğday ekmeği + domates", k: 320 },
                { t: "Ara öğün", f: "1 elma + 10 adet badem", k: 180 },
                { t: "Öğle", f: "Izgara tavuk (150g) + quinoa (½ kase) + salata", k: 480 },
                { t: "Ara öğün", f: "Yağsız yoğurt (150g) + yarım avuç ceviz", k: 200 },
                { t: "Akşam", f: "Somon (120g) fırında + buharda brokoli + zeytinyağı", k: 420 },
            ]
        },
        {
            day: "Sal", meals: [
                { t: "Kahvaltı", f: "Yulaf ezmesi (50g) + yaban mersini + 1 kaşık chia", k: 330 },
                { t: "Ara öğün", f: "1 muz + 2 kaşık yerfıstığı ezmesi", k: 220 },
                { t: "Öğle", f: "Mercimek çorbası (büyük kase) + tam buğday ekmeği", k: 460 },
                { t: "Ara öğün", f: "Havuç + humus", k: 150 },
                { t: "Akşam", f: "Hindi kıyma (150g) + fırın sebze (kabak, biber, soğan)", k: 400 },
            ]
        },
        {
            day: "Çar", meals: [
                { t: "Kahvaltı", f: "Peynirli omlet (2 yumurta, az yağ) + salatalık", k: 280 },
                { t: "Ara öğün", f: "Kefir (200ml) + yarım avuç fındık", k: 190 },
                { t: "Öğle", f: "Ton balıklı salata (marul, domates, zeytin, ton 100g)", k: 380 },
                { t: "Ara öğün", f: "Lor peyniri (100g) + 1 tatlı kaşığı bal", k: 160 },
                { t: "Akşam", f: "Tavuk ızgara (150g) + haşlama tatlı patates (150g)", k: 450 },
            ]
        },
        {
            day: "Per", meals: [
                { t: "Kahvaltı", f: "Tam tahıl granola (40g) + süt + çilek", k: 340 },
                { t: "Ara öğün", f: "1 portakal + 10 kaju fıstığı", k: 175 },
                { t: "Öğle", f: "Nohut yemeği (1 kase) + yoğurt + salata", k: 490 },
                { t: "Ara öğün", f: "Yağsız süt + 2 tam tahıl grisini", k: 140 },
                { t: "Akşam", f: "Levrek (130g) fırında + zeytinyağlı ıspanak", k: 400 },
            ]
        },
        {
            day: "Cum", meals: [
                { t: "Kahvaltı", f: "Protein smoothie: süt 200ml + muz + 1 kaşık protein tozu", k: 310 },
                { t: "Ara öğün", f: "Küçük avuç karışık kuruyemiş", k: 190 },
                { t: "Öğle", f: "Tam buğday wrap: tavuk + avokado + salata", k: 500 },
                { t: "Ara öğün", f: "Elma + yağsız yoğurt", k: 160 },
                { t: "Akşam", f: "Dana kıyma (lean, 120g) + domates sosu + tam makarna (70g)", k: 480 },
            ]
        },
        {
            day: "Cmt", meals: [
                { t: "Kahvaltı", f: "Avokadolu tam buğday tost (2 dilim) + haşlama yumurta", k: 370 },
                { t: "Ara öğün", f: "Meyve salatası + 1 kaşık yoğurt", k: 150 },
                { t: "Öğle", f: "Mercimek köfte (8-10 adet) + cacık + salata", k: 430 },
                { t: "Ara öğün", f: "Peynir (30g) + elma", k: 170 },
                { t: "Akşam", f: "Sardalya (100g) + zeytinyağı soslu sebze", k: 380 },
            ]
        },
        {
            day: "Paz", meals: [
                { t: "Kahvaltı", f: "Krepler (tam buğday, 2 adet) + yoğurt + bal", k: 360 },
                { t: "Ara öğün", f: "Kefir + yarım avuç badem", k: 200 },
                { t: "Öğle", f: "Tavuk çorbası (ev yapımı) + tam tahıl ekmek", k: 420 },
                { t: "Ara öğün", f: "Lor peyniri + salatalık", k: 120 },
                { t: "Akşam", f: "Kuru fasulye (1 kase) + bulgur pilavı + salata", k: 460 },
            ]
        },
    ],
    gain: [
        {
            day: "Pzt", meals: [
                { t: "Kahvaltı", f: "3 yumurta omlet + 2 dilim ekmek + süt (250ml)", k: 580 },
                { t: "Ara öğün", f: "Muz + yerfıstığı ezmesi (2 kaşık) + süt", k: 380 },
                { t: "Öğle", f: "Pirinç pilavı (200g) + tavuk ızgara (200g) + salata", k: 720 },
                { t: "Ara öğün", f: "Protein bar + meyve", k: 320 },
                { t: "Akşam", f: "Dana biftek (150g) + fırın patates + brokoli", k: 640 },
            ]
        },
        {
            day: "Sal", meals: [
                { t: "Kahvaltı", f: "Protein pancake (3 adet) + muz + bal", k: 600 },
                { t: "Ara öğün", f: "Süt + granola + yoğurt", k: 400 },
                { t: "Öğle", f: "Makarna (100g kuru) + kıymalı domates sosu", k: 680 },
                { t: "Ara öğün", f: "Haşlama yumurta (2) + tam buğday ekmek", k: 280 },
                { t: "Akşam", f: "Somon (180g) + bulgur pilavı + sebze", k: 650 },
            ]
        },
        {
            day: "Çar", meals: [
                { t: "Kahvaltı", f: "Yulaf ezmesi (70g) + süt + meyve + ceviz", k: 550 },
                { t: "Ara öğün", f: "Smoothie: süt + muz + yulaf + 1 kaşık protein", k: 420 },
                { t: "Öğle", f: "Tavuk döner wrap (2 adet) + ayran", k: 700 },
                { t: "Ara öğün", f: "Lor peyniri + bal + tam ekmek", k: 300 },
                { t: "Akşam", f: "Hindi but (200g) + haşlama patates + salata", k: 620 },
            ]
        },
        {
            day: "Per", meals: [
                { t: "Kahvaltı", f: "3 yumurta menemen + 2 dilim ekmek + süt", k: 570 },
                { t: "Ara öğün", f: "Avokado tost + yumurta", k: 380 },
                { t: "Öğle", f: "Nohutlu pilav (büyük porsiyon) + cacık", k: 680 },
                { t: "Ara öğün", f: "Süt + protein tozu + muz", k: 380 },
                { t: "Akşam", f: "Izgara balık (200g) + sebzeli makarna", k: 630 },
            ]
        },
        {
            day: "Cum", meals: [
                { t: "Kahvaltı", f: "Yoğurtlu müsli (70g) + muz + çilek", k: 520 },
                { t: "Ara öğün", f: "Karışık kuruyemiş + peynir", k: 350 },
                { t: "Öğle", f: "Pirinç + tavuk sote (büyük porsiyon)", k: 720 },
                { t: "Ara öğün", f: "Süt + grisini + meyve", k: 290 },
                { t: "Akşam", f: "Kuzu pirzola (150g) + bulgur + salata", k: 660 },
            ]
        },
        {
            day: "Cmt", meals: [
                { t: "Kahvaltı", f: "Sahanda yumurta (3) + domates + ekmek + süt", k: 580 },
                { t: "Ara öğün", f: "Protein smoothie + muz", k: 380 },
                { t: "Öğle", f: "Dürüm (2 adet) + ayran + salata", k: 700 },
                { t: "Ara öğün", f: "Granola bar + süt", k: 320 },
                { t: "Akşam", f: "Dana kıyma (150g) + makarna + peynir", k: 660 },
            ]
        },
        {
            day: "Paz", meals: [
                { t: "Kahvaltı", f: "Serpme kahvaltı: peynir, yumurta, bal, zeytin, ekmek + süt", k: 600 },
                { t: "Ara öğün", f: "Süt + ceviz + kuru kayısı", k: 320 },
                { t: "Öğle", f: "Etli nohut (büyük kase) + pilav + salata", k: 720 },
                { t: "Ara öğün", f: "Yoğurt + meyve + granola", k: 280 },
                { t: "Akşam", f: "Tavuk sote (200g) + fırın sebze + tam ekmek", k: 620 },
            ]
        },
    ],
    muscle: [
        {
            day: "Pzt", meals: [
                { t: "Kahvaltı", f: "4 yumurta omlet + yulaf (60g) + muz", k: 620 },
                { t: "Ara öğün", f: "Yoğurt + granola + meyve", k: 350 },
                { t: "Öğle", f: "Tavuk ızgara (200g) + pirinç (200g) + salata", k: 720 },
                { t: "Antrenman sonrası", f: "Protein shake + muz", k: 300 },
                { t: "Akşam", f: "Somon (150g) + tatlı patates + brokoli", k: 540 },
            ]
        },
        {
            day: "Sal", meals: [
                { t: "Kahvaltı", f: "Protein pancake (3) + yaban mersini + bal", k: 590 },
                { t: "Ara öğün", f: "Lor peyniri + ceviz + elma", k: 280 },
                { t: "Öğle", f: "Hindi (200g) + bulgur (180g) + sebze", k: 700 },
                { t: "Ara öğün", f: "Haşlama yumurta (2) + tam buğday ekmek", k: 280 },
                { t: "Akşam", f: "Dana biftek (150g) + fırın sebze + salata", k: 560 },
            ]
        },
        {
            day: "Çar", meals: [
                { t: "Kahvaltı", f: "Yulaf ezmesi (70g) + süt + 2 yumurta + meyve", k: 580 },
                { t: "Ara öğün", f: "Protein smoothie (süt + protein tozu + muz)", k: 380 },
                { t: "Öğle", f: "Ton balığı wrap (2 adet) + sebze", k: 650 },
                { t: "Ara öğün", f: "Yoğurt + badem", k: 220 },
                { t: "Akşam", f: "Tavuk (180g) + makarna (80g kuru) + peynir", k: 640 },
            ]
        },
        {
            day: "Per", meals: [
                { t: "Kahvaltı", f: "3 yumurta menemen + ekmek + süt", k: 560 },
                { t: "Ara öğün", f: "Muz + yerfıstığı ezmesi + süt", k: 350 },
                { t: "Öğle", f: "Nohut salatası (büyük) + tavuk (150g) + pilav", k: 720 },
                { t: "Antrenman sonrası", f: "Protein shake + muz veya ekmek", k: 320 },
                { t: "Akşam", f: "Levrek (150g) + quinoa + sebze", k: 520 },
            ]
        },
        {
            day: "Cum", meals: [
                { t: "Kahvaltı", f: "Avokadolu tost (2) + 2 haşlama yumurta + süt", k: 570 },
                { t: "Ara öğün", f: "Yoğurt + granola + çilek", k: 300 },
                { t: "Öğle", f: "Pirinç (200g) + tavuk sote (200g)", k: 700 },
                { t: "Ara öğün", f: "Cottage cheese + elma", k: 200 },
                { t: "Akşam", f: "Kuzu pirzola (150g) + bulgur + salata", k: 580 },
            ]
        },
        {
            day: "Cmt", meals: [
                { t: "Kahvaltı", f: "Protein waffle (2) + muz + bal", k: 560 },
                { t: "Ara öğün", f: "Süt + granola + ceviz", k: 360 },
                { t: "Öğle", f: "Dana kıyma (150g) + makarna + domates sosu", k: 680 },
                { t: "Ara öğün", f: "Protein bar", k: 250 },
                { t: "Akşam", f: "Tavuk (200g) + patates (150g) + brokoli", k: 620 },
            ]
        },
        {
            day: "Paz", meals: [
                { t: "Kahvaltı", f: "Serpme: yumurta, peynir, zeytin, domates, ekmek + süt", k: 580 },
                { t: "Ara öğün", f: "Meyve salatası + yoğurt", k: 200 },
                { t: "Öğle", f: "Mercimek çorbası + tam ekmek + yoğurt", k: 450 },
                { t: "Ara öğün", f: "Protein smoothie", k: 300 },
                { t: "Akşam", f: "Somon (180g) + pirinç (180g) + salata", k: 660 },
            ]
        },
    ],
    maintain: [
        {
            day: "Pzt", meals: [
                { t: "Kahvaltı", f: "2 yumurta + yulaf (50g) + meyve", k: 430 },
                { t: "Ara öğün", f: "Yoğurt + fındık", k: 200 },
                { t: "Öğle", f: "Tavuk (150g) + bulgur (150g) + salata", k: 560 },
                { t: "Ara öğün", f: "Meyve + lor peyniri", k: 180 },
                { t: "Akşam", f: "Balık (130g) + sebze + tam buğday ekmek", k: 450 },
            ]
        },
        {
            day: "Sal", meals: [
                { t: "Kahvaltı", f: "Tam buğday tost + avokado + haşlama yumurta", k: 420 },
                { t: "Ara öğün", f: "Elma + badem", k: 185 },
                { t: "Öğle", f: "Mercimek çorbası + tam ekmek + cacık", k: 490 },
                { t: "Ara öğün", f: "Kefir + kuru meyve", k: 180 },
                { t: "Akşam", f: "Hindi (150g) + fırın sebze", k: 430 },
            ]
        },
        {
            day: "Çar", meals: [
                { t: "Kahvaltı", f: "Yoğurt + granola + meyve", k: 380 },
                { t: "Ara öğün", f: "Ceviz + peynir", k: 190 },
                { t: "Öğle", f: "Ton balığı salatası + tam ekmek", k: 480 },
                { t: "Ara öğün", f: "Süt + muz", k: 200 },
                { t: "Akşam", f: "Tavuk sote + pilav (150g) + salata", k: 510 },
            ]
        },
        {
            day: "Per", meals: [
                { t: "Kahvaltı", f: "2 yumurta omlet + sebze + ekmek", k: 390 },
                { t: "Ara öğün", f: "Elma + fındık", k: 175 },
                { t: "Öğle", f: "Nohut yemeği + yoğurt + salata", k: 520 },
                { t: "Ara öğün", f: "Protein smoothie (hafif)", k: 220 },
                { t: "Akşam", f: "Somon (130g) + haşlama sebze", k: 440 },
            ]
        },
        {
            day: "Cum", meals: [
                { t: "Kahvaltı", f: "Müsli + süt + meyve", k: 410 },
                { t: "Ara öğün", f: "Yoğurt + bal", k: 160 },
                { t: "Öğle", f: "Wrap: tavuk + salata + yoğurt sosu", k: 530 },
                { t: "Ara öğün", f: "Meyve + lor", k: 150 },
                { t: "Akşam", f: "Balık (130g) + patates (100g) + salata", k: 480 },
            ]
        },
        {
            day: "Cmt", meals: [
                { t: "Kahvaltı", f: "Avokadolu tost + yumurta + süt", k: 430 },
                { t: "Ara öğün", f: "Kefir + granola", k: 220 },
                { t: "Öğle", f: "Ev yapımı köfte (3) + bulgur + cacık", k: 560 },
                { t: "Ara öğün", f: "Meyve salatası", k: 130 },
                { t: "Akşam", f: "Hindi (130g) + makarna (70g) + salata", k: 490 },
            ]
        },
        {
            day: "Paz", meals: [
                { t: "Kahvaltı", f: "Haftalık serpme kahvaltı (hafif porsiyon)", k: 480 },
                { t: "Ara öğün", f: "Yoğurt + meyve", k: 160 },
                { t: "Öğle", f: "Mercimek köfte + ayran + salata", k: 430 },
                { t: "Ara öğün", f: "Peynir + tam ekmek", k: 180 },
                { t: "Akşam", f: "Balık çorbası + tam ekmek", k: 400 },
            ]
        },
    ],
};

const exercisePlans = {
    lose: [
        { icon: "🚶", title: "Yürüyüş (günlük)", desc: "Hızlı tempoda 30–45 dk yürüyüş. ~200–300 kcal yakar, insülin duyarlılığını artırır." },
        { icon: "🚴", title: "Cardio 3x/hafta", desc: "Bisiklet, yüzme veya eliptik 30 dk. Yağ yakımını hızlandırır, eklem yükü azdır." },
        { icon: "🏋️", title: "Ağırlık 2x/hafta", desc: "Yağ kaybederken kas kütleni korumak için direnç egzersizleri şart." },
        { icon: "🧘", title: "Aktif dinlenme", desc: "Stres kortizol artırır ve kilo vermeyi zorlaştırır. Hafif yoga veya nefes egzersizleri ekle." },
    ],
    gain: [
        { icon: "🏋️", title: "Bileşik hareketler 4x/hafta", desc: "Squat, deadlift, bench press kas büyümesini en çok uyaran hareketlerdir." },
        { icon: "😴", title: "Dinlenme ve uyku", desc: "Kaslar antrenman sırasında değil, dinlenirken büyür. 7–9 saat uyku hedefle." },
        { icon: "🥛", title: "Antrenman sonrası beslenme", desc: "Egzersizden 30–60 dk içinde protein + karbonhidrat kombinasyonu tüket." },
        { icon: "📈", title: "Progressif yüklenme", desc: "Her hafta ağırlık ya da tekrar sayısını biraz artır. Kas yeni uyarıcıya ihtiyaç duyar." },
    ],
    muscle: [
        { icon: "💪", title: "Progressif yüklenme", desc: "Hafta hafta ağırlık veya tekrar artır. Kas büyümesi için sürekli yeni uyarıcı gerekir." },
        { icon: "🏋️", title: "Split antrenman 4–5x/hafta", desc: "Push/pull/legs veya üst/alt split denge ve yoğunluk açısından idealdir." },
        { icon: "🧘", title: "Mobility çalışması", desc: "Her antrenmandan sonra 10 dk esneme. Sakatlanma riskini azaltır." },
        { icon: "🥩", title: "Yüksek protein alımı", desc: "Kilogram başına 1.8–2.2 g protein. Antrenman günleri özellikle dikkat et." },
    ],
    maintain: [
        { icon: "🚴", title: "Karma cardio 2x/hafta", desc: "Haftada 2 cardio + 2 kuvvet antrenmanı genel sağlık ve enerjiyi korur." },
        { icon: "🧘", title: "Esneklik çalışması", desc: "Haftada 2–3x yoga veya esneme. Duruşu düzeltir, gerginliği azaltır." },
        { icon: "🚶", title: "Aktif yaşam", desc: "Merdiveni tercih et, kısa mesafeleri yürü. Günde 8.000+ adım hedefle." },
        { icon: "⚖️", title: "Denge", desc: "Cardio ve kuvveti dengeli tut. Sadece biri kas veya kondisyon kaybına yol açabilir." },
    ],
};

// ─── Alt bileşenler ────────────────────────────────────────────────────────
function StatusBadge({ actual, target }) {
    const st = getStatus(actual, target);
    return <span className={`pd-badge pd-badge--${st.cls.replace("status-", "")}`}>{st.label}</span>;
}

function NutrientBar({ label, actual, target, unit, color }) {
    const pct = Math.min(Math.round((actual / target) * 100), 100);
    const st = getStatus(actual, target);
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

// ─── Sekmeler ─────────────────────────────────────────────────────────────
function PlanTab({ data, targets, goalCal }) {
    const [activeDay, setActiveDay] = useState(0);
    const plan = weeklyPlans[data.goal] || weeklyPlans.maintain;
    const dayData = plan[activeDay];
    const dayTotal = dayData.meals.reduce((a, m) => a + m.k, 0);

    const metricItems = [
        { v: Math.round(goalCal), l: "Kalori", u: "kcal" },
        { v: targets.protein, l: "Protein", u: "g" },
        { v: targets.carb, l: "Karbonhidrat", u: "g" },
        { v: targets.fat, l: "Yağ", u: "g" },
        { v: targets.water, l: "Su", u: "ml" },
    ];

    return (
        <>
            <div className="pd-card">
                <h3 className="pd-card-title">Günlük hedefler</h3>
                <div className="pd-metric-row">
                    {metricItems.map(({ v, l, u }) => (
                        <div className="pd-metric" key={l}>
                            <div className="pd-metric-val">{v}<span className="pd-metric-unit"> {u}</span></div>
                            <div className="pd-metric-lbl">{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pd-card">
                <h3 className="pd-card-title">Haftalık diyet planı</h3>
                <div className="pd-day-tabs">
                    {plan.map((d2, i) => (
                        <button
                            key={i}
                            className={`pd-day-btn${activeDay === i ? " pd-day-btn--active" : ""}`}
                            onClick={() => setActiveDay(i)}
                        >
                            {d2.day}
                        </button>
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
                    <div className="pd-meal-total">
                        <span>Toplam</span>
                        <span>{dayTotal} kcal</span>
                    </div>
                </div>
            </div>
        </>
    );
}

function TodayTab({ data, totals, water, targets }) {
    const bars = [
        { label: "Kalori", actual: Math.round(totals.kcal), target: targets.kcal, unit: "kcal", color: "#378ADD" },
        { label: "Protein", actual: Math.round(totals.protein), target: targets.protein, unit: "g", color: "#1D9E75" },
        { label: "Karbonhidrat", actual: Math.round(totals.carb), target: targets.carb, unit: "g", color: "#BA7517" },
        { label: "Yağ", actual: Math.round(totals.fat), target: targets.fat, unit: "g", color: "#D4537E" },
        { label: "Su", actual: Math.round(water), target: targets.water, unit: "ml", color: "#7F77DD" },
    ];

    const hasMeals = (data.meals_log || []).some(m => m.kcal);

    return (
        <>
            <div className="pd-card">
                <h3 className="pd-card-title">Bugünkü tüketim</h3>
                <div className="pd-bars">
                    {bars.map(b => <NutrientBar key={b.label} {...b} />)}
                </div>
            </div>
            <div className="pd-card">
                <h3 className="pd-card-title">Öğün detayları</h3>
                {!hasMeals ? (
                    <p className="pd-empty">Bugün için öğün verisi girilmemiş.</p>
                ) : (
                    <div className="pd-meal-list">
                        {(data.meals_log || []).map((m, i) => (
                            m.kcal ? (
                                <div className="pd-meal-row" key={i}>
                                    <span className="pd-meal-label">{m.name || `Öğün ${i + 1}`}</span>
                                    <span className="pd-meal-food">
                                        {m.kcal} kcal | P:{m.protein || 0}g K:{m.carb || 0}g Y:{m.fat || 0}g
                                    </span>
                                </div>
                            ) : null
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function CompareTab({ totals, water, targets }) {
    const rows = [
        { label: "Kalori", actual: Math.round(totals.kcal), target: targets.kcal, unit: "kcal" },
        { label: "Protein", actual: Math.round(totals.protein), target: targets.protein, unit: "g" },
        { label: "Karbonhidrat", actual: Math.round(totals.carb), target: targets.carb, unit: "g" },
        { label: "Yağ", actual: Math.round(totals.fat), target: targets.fat, unit: "g" },
        { label: "Su", actual: Math.round(water), target: targets.water, unit: "ml" },
    ];

    const tips = [];
    rows.forEach(r => {
        const st = getStatus(r.actual, r.target);
        const diff = Math.round(Math.abs(r.actual - r.target));
        if (st.label === "Az") {
            if (r.label === "Kalori") tips.push(`Kalori alımın ${diff} kcal eksik. Bir ara öğün eklemen yeterli olabilir.`);
            if (r.label === "Protein") tips.push(`Protein ${diff}g eksik. Akşam yemeğine biraz daha tavuk, yumurta veya baklagil eklemek fark yaratır.`);
            if (r.label === "Karbonhidrat") tips.push(`Karbonhidrat ${diff}g altında. Tam tahıl ürünleri veya meyve ile dengeleyebilirsin.`);
            if (r.label === "Yağ") tips.push(`Sağlıklı yağ ${diff}g az. Zeytinyağı, avokado veya kuruyemiş iyi alternatifler.`);
            if (r.label === "Su") tips.push(`Bugün ${diff}ml daha su içmeyi dene. Yanında küçük bir şişe taşımak işe yarar.`);
        } else if (st.label === "Fazla") {
            if (r.label === "Kalori") tips.push(`Kalori hedefini ${diff} kcal aştın. Yarın porsiyonlara dikkat etmek yeterli.`);
            if (r.label === "Protein") tips.push(`Protein biraz yüksek (${diff}g fazla). Bol su içmeye özen göster.`);
            if (r.label === "Karbonhidrat") tips.push(`Karbonhidrat ${diff}g fazla. Bir sonraki öğünde basit şekerlerden kaçınmayı deneyebilirsin.`);
            if (r.label === "Yağ") tips.push(`Yağ alımın ${diff}g fazla. Kızartma yerine ızgara veya buğulama tercih edilebilir.`);
        }
    });
    if (tips.length === 0) tips.push("Harika! Bugün tüm değerlerin hedef aralığında. Böyle devam et!");

    return (
        <>
            <div className="pd-card">
                <h3 className="pd-card-title">Hedef vs gerçek</h3>
                <div className="pd-compare-list">
                    {rows.map(r => {
                        const st = getStatus(r.actual, r.target);
                        const diff = Math.round(Math.abs(r.actual - r.target));
                        const msg = st.label === "Normal" ? "Hedefte" : `${diff} ${r.unit} ${st.dir}`;
                        return (
                            <div className="pd-compare-row" key={r.label}>
                                <span className="pd-c-label">{r.label}</span>
                                <span className="pd-c-actual">{r.actual} {r.unit}</span>
                                <span className="pd-c-target">Hedef: {r.target}</span>
                                <span className={`pd-badge pd-badge--${st.cls.replace("status-", "")}`}>{st.label}</span>
                                <span className="pd-c-diff">{msg}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="pd-card">
                <h3 className="pd-card-title">Öneriler</h3>
                {tips.map((t, i) => (
                    <div className="pd-tip" key={i}>{t}</div>
                ))}
            </div>
        </>
    );
}

function ExerciseTab({ data }) {
    const exList = exercisePlans[data.goal] || exercisePlans.maintain;
    return (
        <div className="pd-card">
            <h3 className="pd-card-title">Hedefe özel egzersiz planı</h3>
            {data.exercises === "no" && (
                <div className="pd-warn-box">
                    Şu an egzersiz yapmıyorsun. Haftada 3x 15 dakika yürüyüşle başlamak bile büyük bir adım!
                </div>
            )}
            <div className="pd-ex-list">
                {exList.map((ex, i) => (
                    <div className="pd-ex-card" key={i}>
                        <div className="pd-ex-icon">{ex.icon}</div>
                        <div>
                            <div className="pd-ex-title">{ex.title}</div>
                            <div className="pd-ex-desc">{ex.desc}</div>
                        </div>
                    </div>
                ))}
                {data.stress === "high" && (
                    <div className="pd-ex-card">
                        <div className="pd-ex-icon">🧘</div>
                        <div>
                            <div className="pd-ex-title">Stres yönetimi egzersizi</div>
                            <div className="pd-ex-desc">Yüksek kortizol kilo yönetimini zorlaştırır. Hafif yürüyüş, meditasyon veya derin nefes teknikleri ekle.</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Ana bileşen ──────────────────────────────────────────────────────────
export default function PlanDashboard({ data: propData }) {
    const [activeTab, setActiveTab] = useState("plan");

    // Prop'tan gelen data yoksa sessionStorage'dan oku
    const data = propData || (() => {
        try { return JSON.parse(sessionStorage.getItem("calcData") || "null"); } catch { return null; }
    })();

    if (!data) {
        return (
            <div className="pd-empty-state">
                <p>Veri bulunamadı. Lütfen önce hesaplayıcıyı tamamlayın.</p>
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
        (a, m) => ({
            kcal: a.kcal + (parseFloat(m.kcal) || 0),
            protein: a.protein + (parseFloat(m.protein) || 0),
            carb: a.carb + (parseFloat(m.carb) || 0),
            fat: a.fat + (parseFloat(m.fat) || 0),
        }),
        { kcal: 0, protein: 0, carb: 0, fat: 0 }
    );
    const water = parseFloat(data.water) || 0;

    const tabs = [
        { id: "plan", label: "Haftalık Plan" },
        { id: "today", label: "Bugünkü Analiz" },
        { id: "compare", label: "Karşılaştırma" },
        { id: "exercise", label: "Egzersiz" },
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
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === "plan" && <PlanTab data={data} targets={targets} goalCal={goalCal} />}
            {activeTab === "today" && <TodayTab data={data} totals={totals} water={water} targets={targets} />}
            {activeTab === "compare" && <CompareTab totals={totals} water={water} targets={targets} />}
            {activeTab === "exercise" && <ExerciseTab data={data} />}
        </div>
    );
}