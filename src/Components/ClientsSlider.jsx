import { useEffect, useRef, useState } from "react";
import '../Style/ClientsSlider.css'
const clients = [
    { img: "https://assets.mynetdiary.com/images/success-story-julie@1x.png", name: "Julie Martel", result: "Lost 71 lb (35%) — kept it off 492 days", quote: "My life has changed. My life is beautiful! And I am beautiful too." },
    { img: "https://assets.mynetdiary.com/images/success-matthew-warner@1x.png", name: "Matthew Warner", result: "Lost 99 lb (41%) — kept it off 430 days", quote: "My confidence is back. I feel stronger every day. This journey changed me." },
    { img: "https://assets.mynetdiary.com/images/success-rick-white@1x.png", name: "Rick White", result: "Lost 88 lb (40%) — kept it off 410 days", quote: "I got my health back. I feel alive again. Best decision I ever made." },
    { img: "https://assets.mynetdiary.com/images/success-story-joe@1x.png", name: "Joe Carter", result: "Lost 110 lb (48%) — kept it off 520 days", quote: "I have endless energy now. My life is totally different. I feel amazing." },
    { img: "https://assets.mynetdiary.com/images/success-paul-reynolds@1x.png", name: "Paul Reynolds", result: "Lost 121 lb (50%) — kept it off 600 days", quote: "I never thought this was possible. Now I live my best life. I am proud of myself." },
    { img: "https://assets.mynetdiary.com/images/success-story-carrie@1x.png", name: "Carrie Johnson", result: "Lost 77 lb (36%) — kept it off 390 days", quote: "I love myself again. I feel confident and happy. This changed everything." },
];

const DURATION = 4000;

export default function ClientsSlider() {
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);
    const progressRef = useRef(null);
    const startTimeRef = useRef(null);

    const goTo = (idx) => {
        const next = (idx + clients.length) % clients.length;
        setCurrent(next);
    };

    useEffect(() => {
        clearInterval(timerRef.current);
        clearInterval(progressRef.current);
        setProgress(0);
        startTimeRef.current = Date.now();

        progressRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            setProgress(Math.min((elapsed / DURATION) * 100, 100));
        }, 30);

        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % clients.length);
        }, DURATION);

        return () => {
            clearInterval(timerRef.current);
            clearInterval(progressRef.current);
        };
    }, [current]);

    return (
        <div className="cs-root">
            <p className="cs-label">Success Stories</p>
            <h2 className="cs-heading">Real people, real results</h2>

            <div className="cs-track-wrap">
                <div
                    className="cs-track"
                    style={{ transform: `translateX(calc(-${current * 100}% - ${current * 28}px))` }}
                >
                    {clients.map((c, i) => (
                        <div
                            key={i}
                            className={`cs-card${i === current ? " cs-card--active" : ""}`}
                            onClick={() => goTo(i)}
                        >
                            <img className="cs-img" src={c.img} alt={c.name} />
                            <div className="cs-body">
                                <p className="cs-quote">{c.quote}</p>
                                <p className="cs-name">{c.name}</p>
                                <p className="cs-result">{c.result}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <div className="cs-progress-wrap">
                <div className="cs-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="cs-dots">
                {clients.map((_, i) => (
                    <button
                        key={i}
                        className={`cs-dot${i === current ? " cs-dot--active" : ""}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>

            <div className="cs-arrows">
                <button className="cs-arrow" onClick={() => goTo(current - 1)}>&#8592;</button>
                <button className="cs-arrow" onClick={() => goTo(current + 1)}>&#8594;</button>
            </div>
        </div>
    );
}