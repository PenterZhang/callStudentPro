import { useRef } from "react";
import type { PunishData, PunishMap, PunishStatus } from "../types";
import { useAudio } from "./useAudio";
import { sleep } from "../utils/random";

export const usePunish = (
    currentClass: string,
    activeSubject: string,
    punishData: PunishData,
    setPunishMap: React.Dispatch<React.SetStateAction<PunishMap>>,
    currentPunish: PunishStatus
) => {
    const isRollingRef = useRef(false);
    const startTimeRef = useRef<number>(0);
    const { playTick, playBoom, speak } = useAudio();

    const handlePunish = (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. 获取点击目标，判断是否点到了那个“查看记录”的小字
        const target = e.target as HTMLElement;
        const isClickHint = target.classList.contains("view-punish-hint");

        /**
         * 逻辑拦截：
         * - 如果已经抽满 2 次，无论点哪都只负责“唤醒显示”。
         * - 如果点的是“查看记录”小字，且已有结果 (count > 0)，也只负责“唤醒显示”。
         */
        if (currentPunish.count >= 2 || (isClickHint && currentPunish.count > 0)) {
            setPunishMap((prev) => ({
                ...prev,
                [currentClass]: { ...currentPunish, isActive: true }
            }));
            return;
        }

        // 2. 状态锁：转动过程中禁止重复触发
        if (isRollingRef.current) return;

        // --- 开始正式抽取逻辑（适用于第一次抽取 & 按钮触发的第二次抽取） ---
        const pool = [...(punishData[activeSubject] || []), ...(punishData["综合"] || [])];
        const safePool = pool.length > 0 ? pool : ["请先录入惩罚内容"];
        const nextCount = currentPunish.count + 1;

        isRollingRef.current = true;
        startTimeRef.current = Date.now();

        const timer = window.setInterval(async () => {
            const p = safePool[Math.floor(Math.random() * safePool.length)];

            if (Date.now() - startTimeRef.current > 1500) {
                window.clearInterval(timer);
                isRollingRef.current = false;

                setPunishMap((prev) => ({
                    ...prev,
                    [currentClass]: { count: nextCount, text: p, isActive: true }
                }));

                playBoom();
                await sleep(800);
                speak(`惩罚内容：${p}`);
            } else {
                setPunishMap((prev) => ({
                    ...prev,
                    [currentClass]: { count: nextCount, text: p, isActive: true }
                }));
                playTick();
            }
        }, 80);
    };

    return { handlePunish };
};
