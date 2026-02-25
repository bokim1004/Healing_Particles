import { useRef } from "react";
import { useHealingPhase } from "./hooks/useHealingPhase";
import { useParticleScene } from "./hooks/useParticleScene";
import { useBreathingGuide } from "./hooks/useBreathingGuide";
import {
    InputOverlay,
    ScatteredOverlay,
    BreathingOverlay,
    ReleaseOverlay,
    AmplifyOverlay,
    PeaceOverlay,
    RetryButton,
} from "./components/PhaseOverlay";

export default function HealingParticles() {
    const containerRef = useRef(null);

    const {
        phase,
        emotion,
        emotionName,
        emotionData,
        breathingText,
        stateRef,
        setPhase,
        setEmotion,
        setBreathingText,
        handleEmotionSubmit,
        handleClick,
        handleRestart,
    } = useHealingPhase();

    // Three.js 파티클 씬
    useParticleScene(containerRef, phase, emotionData, stateRef);

    // 호흡 가이드 & 자동 전환
    useBreathingGuide(phase, emotionData, stateRef, setBreathingText, setPhase);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100dvh",
                background: "#000",
                overflow: "hidden",
                cursor: phase === "input" ? "default" : (phase === "scattered" ? "pointer" : "none"),
                fontFamily: "'Inter', sans-serif",
            }}
            onClick={handleClick}
        >
            {/* Input Phase */}
            {phase === "input" && (
                <InputOverlay
                    emotion={emotion}
                    onEmotionChange={setEmotion}
                    onSubmit={handleEmotionSubmit}
                />
            )}

            {/* Ambient Background */}
            {phase !== "input" && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60vw",
                        height: "60vh",
                        background: "radial-gradient(circle, rgba(80,40,20,0.12) 0%, rgba(0,0,0,0) 70%)",
                        filter: "blur(100px)",
                        pointerEvents: "none",
                    }}
                />
            )}

            {/* Canvas */}
            {phase !== "input" && (
                <div
                    ref={containerRef}
                    style={{
                        width: "100%",
                        height: "100dvh",
                        opacity: 0.95,
                    }}
                />
            )}

            {/* Phase-specific overlays */}
            {phase === "scattered" && (
                <ScatteredOverlay emotionName={emotionName} />
            )}

            {phase === "breathing" && (
                <BreathingOverlay breathingText={breathingText} />
            )}

            {phase === "release" && (
                <ReleaseOverlay emotionName={emotionName} />
            )}

            {phase === "amplify" && (
                <AmplifyOverlay emotionName={emotionName} />
            )}

            {phase === "peace" && (
                <PeaceOverlay
                    emotionName={emotionName}
                    emotionData={emotionData}
                />
            )}

            {phase === "peace" && (
                <RetryButton onRestart={handleRestart} />
            )}
        </div>
    );
}