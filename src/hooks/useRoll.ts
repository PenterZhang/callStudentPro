import { useRef } from "react";
import type { ClassData, PunishMap } from "../types";
import { getWeightedRandom, sleep } from "../utils/random";
import { useAudio } from "./useAudio";

export const useRoll = (
    currentClass: string,
    classMap: ClassData,
    setClassMap: React.Dispatch<React.SetStateAction<ClassData>>,
    setRecordMap: React.Dispatch<React.SetStateAction<ClassData>>,
    setRollBtnText: (text: string) => void,
    createBgName: () => void,
    setPunishMap: React.Dispatch<React.SetStateAction<PunishMap>> // 核心：增加此参数
) => {
    const rollTimerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const { playTick, playBoom, speak } = useAudio();

    const handleRoll = (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. 核心修复：点名开始，立即重置该班级的惩罚状态
        setPunishMap((prev) => ({
            ...prev,
            [currentClass]: { count: 0, text: "", isActive: false }
        }));

        const remaining = classMap[currentClass] || [];
        if (remaining.length === 0) {
            alert("名单已点完，请清空历史重置！");
            return;
        }

        if (rollTimerRef.current) window.clearInterval(rollTimerRef.current);
        startTimeRef.current = Date.now();

        rollTimerRef.current = window.setInterval(async () => {
            const randomDisplay = remaining[Math.floor(Math.random() * remaining.length)];
            setRollBtnText(randomDisplay.name);
            playTick();
            createBgName();

            if (Date.now() - startTimeRef.current > 2000) {
                if (rollTimerRef.current) window.clearInterval(rollTimerRef.current);

                const final = getWeightedRandom(remaining);
                setRollBtnText(final.name);

                setClassMap((prev) => ({
                    ...prev,
                    [currentClass]: prev[currentClass].filter((s) => s.name !== final.name)
                }));
                setRecordMap((prev) => ({
                    ...prev,
                    [currentClass]: [final, ...(prev[currentClass] || [])]
                }));

                playBoom();
                await sleep(800);
                speak(`请${final.name}同学回答问题`);
            }
        }, 80);
    };

    return { handleRoll };
};
