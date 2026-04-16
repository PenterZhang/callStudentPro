import * as XLSX from "xlsx";
import type { Student } from "../types";

// 必须确保这里有 export 关键字
export const parseExcelFile = (file: File): Promise<{ className: string; students: Student[] }> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        const fileName = file.name.replace(/\.[^/.]+$/, "");

        reader.onload = (evt) => {
            const dataBuffer = evt.target?.result;
            if (!dataBuffer) return resolve({ className: fileName, students: [] });

            const wb = XLSX.read(dataBuffer, { type: "array" });
            const ws = wb.Sheets[wb.SheetNames[0]]; // 确保取到了第一张表
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as (string | number)[][];

            if (data && data.length > 0) {
                const firstRowStr = String(data[0][0] || "") + String(data[0][1] || "");
                const hasHeader =
                    firstRowStr.includes("名") ||
                    firstRowStr.includes("权") ||
                    firstRowStr.includes("name");
                const validData = hasHeader ? data.slice(1) : data;

                const imported: Student[] = validData
                    .filter((row) => row && row[0] && String(row[0]).trim() !== "")
                    .map((row) => ({
                        name: String(row[0]).trim(),
                        weight: row[1] && typeof row[1] === "number" ? row[1] : 1
                    }));

                resolve({ className: fileName, students: imported });
            } else {
                resolve({ className: fileName, students: [] });
            }
        };
        reader.readAsArrayBuffer(file);
    });
};
