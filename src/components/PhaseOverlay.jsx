import { getSubjectParticle } from "../utils/koreanHelper";

// --- Keyframe styles ---
const keyframes = `
    @keyframes pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.6; }
    }
    @keyframes fadeInOut {
        from { opacity: 0.6; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1.02); }
    }
    @keyframes retryFadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
    }
`;

// --- Input Phase ---
export function InputOverlay({ emotion, onEmotionChange, onSubmit }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                width: "90%",
                maxWidth: "500px",
                zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <h2
                style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "18px",
                    fontWeight: 300,
                    letterSpacing: "0.15em",
                    marginBottom: "30px",
                    textTransform: "uppercase",
                }}
            >
                지금 느끼는 감정을 입력하세요
            </h2>
            <form
                onSubmit={onSubmit}
                onClick={(e) => e.stopPropagation()}
                style={{ width: "100%" }}
            >
                <input
                    type="text"
                    value={emotion}
                    onChange={(e) => onEmotionChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="예: 화가나, 슬퍼, 불안해..."
                    autoFocus
                    style={{
                        width: "100%",
                        padding: "16px 24px",
                        fontSize: "16px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        color: "white",
                        outline: "none",
                        textAlign: "center",
                        letterSpacing: "0.05em",
                        transition: "all 0.3s ease",
                        boxSizing: "border-box",
                        pointerEvents: "auto",
                    }}
                    onFocus={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.08)";
                        e.target.style.borderColor = "rgba(255,255,255,0.4)";
                    }}
                    onBlur={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.05)";
                        e.target.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                />
                <button
                    type="submit"
                    style={{
                        marginTop: "20px",
                        padding: "12px 40px",
                        fontSize: "13px",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "6px",
                        color: "rgba(255,255,255,0.9)",
                        cursor: "pointer",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        transition: "all 0.3s ease",
                        pointerEvents: "auto",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.15)";
                        e.target.style.borderColor = "rgba(255,255,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.1)";
                        e.target.style.borderColor = "rgba(255,255,255,0.3)";
                    }}
                >
                    시작하기
                </button>
            </form>
        </div>
    );
}

// --- Scattered Phase ---
export function ScatteredOverlay({ emotionName }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                textAlign: "center",
            }}
        >
            <p style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "18px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: 0,
            }}>
                당신의 {emotionName}
            </p>
            <p style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "20px",
                animation: "pulse 2s infinite ease-in-out",
            }}>
                Touch
            </p>
            <style>{keyframes}</style>
        </div>
    );
}

// --- Breathing Phase ---
export function BreathingOverlay({ breathingText }) {
    return (
        <div
            style={{
                position: "absolute",
                bottom: "80px",
                left: "50%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                textAlign: "center",
            }}
        >
            <p style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: "18px",
                letterSpacing: "0.3em",
                margin: 0,
                transition: "opacity 0.5s ease",
                textShadow: "0 0 20px rgba(0,0,0,0.8)",
            }}>
                {breathingText}
            </p>
        </div>
    );
}

// --- Release Phase ---
export function ReleaseOverlay({ emotionName }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                textAlign: "center",
            }}
        >
            <p style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
                letterSpacing: "0.3em",
                margin: 0,
            }}>
                당신의 {emotionName}{getSubjectParticle(emotionName)} 흘러가고 있습니다
            </p>
        </div>
    );
}

// --- Amplify Phase ---
export function AmplifyOverlay({ emotionName }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                textAlign: "center",
                zIndex: 10,
                mixBlendMode: "difference",
            }}
        >
            <p style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: 300,
                letterSpacing: "0.5em",
                margin: 0,
                textShadow: "0 0 10px rgba(255,255,255,0.5)",
                animation: "fadeInOut 2s infinite alternate",
                whiteSpace: "nowrap",
            }}>
                당신의 {emotionName}{getSubjectParticle(emotionName)} 더 빛나고 있습니다
            </p>
            <style>{keyframes}</style>
        </div>
    );
}

// --- Peace Phase ---
export function PeaceOverlay({ emotionName, emotionData }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                textAlign: "center",
                zIndex: 10,
                mixBlendMode: "difference",
            }}
        >
            <p style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 200,
                letterSpacing: "0.5em",
                margin: "0 0 24px 0",
                textShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}>
                {emotionData?.positive
                    ? (emotionName || "평화")
                    : <>당신의 {emotionName}{getSubjectParticle(emotionName)}<br />흘러갔습니다</>
                }
            </p>
            {emotionData?.positive && (
                <p style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "12px",
                    letterSpacing: "0.3em",
                    margin: 0,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                }}>
                    당신의 빛나는 감정을 간직하세요
                </p>
            )}
        </div>
    );
}

// --- Retry Button ---
export function RetryButton({ onRestart }) {
    return (
        <div
            style={{
                position: "absolute",
                bottom: "80px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20,
                textAlign: "center",
            }}
        >
            <button
                onClick={onRestart}
                style={{
                    padding: "10px 32px",
                    fontSize: "11px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "4px",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    transition: "all 0.4s ease",
                    animation: "retryFadeIn 2s ease forwards",
                    opacity: 0,
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.borderColor = "rgba(255,255,255,0.5)";
                    e.target.style.color = "rgba(255,255,255,0.95)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.borderColor = "rgba(255,255,255,0.3)";
                    e.target.style.color = "rgba(255,255,255,0.7)";
                }}
            >
                다시 시작
            </button>
            <style>{keyframes}</style>
        </div>
    );
}
