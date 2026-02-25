import { useState, useRef, useCallback } from "react";
import { getEmotionPalette } from "../utils/emotionPalette";

export function useHealingPhase() {
    const stateRef = useRef({
        progress: 0,
        target: 0,
        colorProgress: 0,
        breathCount: 0,
    });

    const [phase, setPhase] = useState("input");
    const [emotion, setEmotion] = useState("");
    const [emotionName, setEmotionName] = useState("");
    const [emotionData, setEmotionData] = useState(null);
    const [breathingText, setBreathingText] = useState("");

    const colorsRef = useRef({ initial: null, healed: null });

    const handleEmotionSubmit = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        const emotionText = emotion.trim() || "평화로워";
        const data = getEmotionPalette(emotionText);

        setEmotionData(data);
        setEmotionName(data.name);
        setEmotion(emotionText);
        colorsRef.current = { initial: data.initial, healed: data.healed };
        setPhase("scattered");
    }, [emotion]);

    const handleClick = useCallback(() => {
        if (phase === "input") return;

        if (phase === "scattered") {
            stateRef.current.target = 1;
            setPhase("gathering");

            setTimeout(() => {
                setPhase("breathing");
            }, 3000);
        }
    }, [phase]);

    const handleRestart = useCallback((e) => {
        e?.stopPropagation();
        setPhase("input");
        setEmotion("");
        setEmotionName("");
        setEmotionData(null);
        setBreathingText("");
        stateRef.current = { progress: 0, target: 0, colorProgress: 0, breathCount: 0 };
    }, []);

    return {
        // State
        phase,
        emotion,
        emotionName,
        emotionData,
        breathingText,
        stateRef,
        colorsRef,

        // Setters (노출이 필요한 것만)
        setPhase,
        setEmotion,
        setBreathingText,

        // Handlers
        handleEmotionSubmit,
        handleClick,
        handleRestart,
    };
}
