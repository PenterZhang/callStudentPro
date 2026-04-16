import type { PunishData } from "../types";
import { SUBJECTS } from "../constants/subjects";

export const parsePunishText = (text: string): PunishData => {
    const lines = text.split("\n");
    const newData: PunishData = { 综合: [] };
    let currentCat = "综合";

    lines.forEach((line) => {
        const t = line.trim();
        if (!t) return;
        const match = t.match(/^(.+?)[:：]$/);
        const potentialSub = match ? match[1] : t;

        if (SUBJECTS.includes(potentialSub) || potentialSub === "综合") {
            currentCat = potentialSub;
            if (!newData[currentCat]) newData[currentCat] = [];
        } else {
            newData[currentCat].push(t);
        }
    });
    return newData;
};
