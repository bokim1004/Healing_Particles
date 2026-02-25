import { useEffect } from "react";

export function useBreathingGuide(phase, emotionData, stateRef, setBreathingText, setPhase) {
    // Breathing cycle automation
    useEffect(() => {
        if (phase !== "breathing") return;

        let breathTimer;
        const breathCycle = () => {
            const count = stateRef.current.breathCount;

            if (count >= 3) {
                // After 3 breaths, move to release or amplify
                breathTimer = setTimeout(() => {
                    setBreathingText("");
                    if (emotionData.positive) {
                        setPhase("amplify");
                    } else {
                        setPhase("release");
                    }
                    stateRef.current.colorProgress = 0;
                }, 2000);
                return;
            }

            // Inhale
            setBreathingText("깊게 들이마시세요");
            breathTimer = setTimeout(() => {
                // Hold
                setBreathingText("잠시 멈추세요");
                breathTimer = setTimeout(() => {
                    // Exhale
                    setBreathingText("천천히 내쉬세요");
                    breathTimer = setTimeout(() => {
                        stateRef.current.breathCount += 1;
                        breathCycle();
                    }, 3000);
                }, 1500);
            }, 3000);
        };

        stateRef.current.breathCount = 0;
        breathCycle();

        return () => {
            if (breathTimer) clearTimeout(breathTimer);
        };
    }, [phase]);

    // Auto transition to peace
    useEffect(() => {
        if (phase !== "release" && phase !== "amplify") return;

        const timer = setTimeout(() => {
            setPhase("peace");
        }, 5000);

        return () => clearTimeout(timer);
    }, [phase]);
}
