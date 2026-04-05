export default function ProgressBar({ step, total, label }) {
    const percentage = Math.round((step / total) * 100);

    return (
        <div className="hc-progress-wrap">
            <div className="hc-progress-header">
                <span className="hc-step-label">{label}</span>
                <span className="hc-step-count">{step} / {total}</span>
            </div>

            <div className="hc-progress-track">
                <div
                    className="hc-progress-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}