import type { Student } from "../types";

export const getWeightedRandom = (students: Student[]): Student => {
    const totalWeight = students.reduce((sum, s) => sum + (s.weight || 1), 0);
    let random = Math.random() * totalWeight;
    for (const student of students) {
        if (random < (student.weight || 1)) return student;
        random -= student.weight || 1;
    }
    return students[Math.floor(Math.random() * students.length)];
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
