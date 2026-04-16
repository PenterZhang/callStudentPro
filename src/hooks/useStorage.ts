import { useState, useEffect } from "react";
import type { ClassData, PunishMap, PunishData } from "../types";
import { DEFAULT_PUNISHES } from "../constants/defaultData";

export const useStorage = () => {
    // 1. 初始化 classMap
    const [classMap, setClassMap] = useState<ClassData>(() => {
        const saved = localStorage.getItem("classMap");
        return saved ? JSON.parse(saved) : {};
    });

    // 2. 初始化 currentClass (仅用于冷启动加载)
    const [currentClass, setCurrentClass] = useState<string>(() => {
        const saved = localStorage.getItem("currentClass");
        const classNames = Object.keys(classMap);
        if (saved && classMap[saved]) return saved;
        return classNames.length > 0 ? classNames[0] : "";
    });

    const [recordMap, setRecordMap] = useState<ClassData>(() =>
        JSON.parse(localStorage.getItem("recordMap") || "{}")
    );

    const [punishMap, setPunishMap] = useState<PunishMap>(() =>
        JSON.parse(localStorage.getItem("punishMap") || "{}")
    );

    const [punishData, setPunishData] = useState<PunishData>(() => {
        const saved = localStorage.getItem("punishData");
        return saved ? JSON.parse(saved) : DEFAULT_PUNISHES;
    });

    const [activeSubject, setActiveSubject] = useState<string>(
        () => localStorage.getItem("activeSubject") || "语文"
    );

    const [rollBtnText, setRollBtnText] = useState<string>(
        () => localStorage.getItem("lastRollName") || "点名"
    );

    // 3. 仅负责同步到本地缓存的 Effect
    useEffect(() => {
        localStorage.setItem("currentClass", currentClass);
        localStorage.setItem("classMap", JSON.stringify(classMap));
        localStorage.setItem("recordMap", JSON.stringify(recordMap));
        localStorage.setItem("punishMap", JSON.stringify(punishMap));
        localStorage.setItem("punishData", JSON.stringify(punishData));
        localStorage.setItem("activeSubject", activeSubject);
        localStorage.setItem("lastRollName", rollBtnText);
    }, [currentClass, classMap, recordMap, punishMap, punishData, activeSubject, rollBtnText]);

    return {
        currentClass,
        setCurrentClass,
        classMap,
        setClassMap,
        recordMap,
        setRecordMap,
        punishMap,
        setPunishMap,
        punishData,
        setPunishData,
        activeSubject,
        setActiveSubject,
        rollBtnText,
        setRollBtnText
    };
};
