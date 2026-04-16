import React, { useState, useRef } from "react";
import type { BgName } from "./types";
import { useStorage } from "./hooks/useStorage";
import { useRoll } from "./hooks/useRoll";
import { usePunish } from "./hooks/usePunish";
import { parseExcelFile } from "./utils/excel";

// 业务组件
import BgBackground from "./components/business/BgBackground";
import HistoryPanel from "./components/business/HistoryPanel";
import RollZone from "./components/business/RollZone";
import AdminControls from "./components/business/AdminControls";

// 弹窗组件
import ClassSelector from "./components/modals/ClassSelector";
import PunishEditor from "./components/modals/PunishEditor";
import PunishDisplay from "./components/modals/PunishDisplay";

import "./App.css";

const App: React.FC = () => {
    const {
        currentClass, setCurrentClass,
        classMap, setClassMap,
        recordMap, setRecordMap,
        punishMap, setPunishMap,
        punishData, setPunishData,
        activeSubject, setActiveSubject,
        rollBtnText, setRollBtnText
    } = useStorage();

    const [bgNames, setBgNames] = useState<BgName[]>([]);
    const [isSwitchOpen, setIsSwitchOpen] = useState(false);
    const [isEditPunishOpen, setIsEditPunishOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createBgName = () => {
        const all = [...(classMap[currentClass] || []), ...(recordMap[currentClass] || [])];
        if (all.length === 0) return;
        const newName: BgName = {
            id: Date.now() + Math.random(),
            name: all[Math.floor(Math.random() * all.length)].name,
            left: Math.random() * 95 + "vw",
            top: Math.random() * 95 + "vh",
            fontSize: Math.floor(Math.random() * 48 + 12) + "px",
            opacity: (Math.random() * 0.6 + 0.3).toFixed(2),
        };
        setBgNames(prev => [...prev, newName]);
        setTimeout(() => setBgNames(prev => prev.filter(n => n.id !== newName.id)), 1000);
    };

    const currentPunish = punishMap[currentClass] || { count: 0, text: "", isActive: false };

    const { handleRoll } = useRoll(
        currentClass, classMap, setClassMap, setRecordMap, setRollBtnText, createBgName, setPunishMap
    );

    const { handlePunish } = usePunish(
        currentClass, activeSubject, punishData, setPunishMap, currentPunish
    );

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const newClassMap = { ...classMap };
        const newRecordMap = { ...recordMap };
        let firstNew = "";
        for (const file of Array.from(files)) {
            const { className, students } = await parseExcelFile(file);
            if (students.length > 0) {
                newClassMap[className] = students;
                newRecordMap[className] = [];
                if (!firstNew) firstNew = className;
            }
        }
        setClassMap(newClassMap);
        setRecordMap(newRecordMap);
        if (!currentClass && firstNew) {
            setCurrentClass(firstNew);
            setRollBtnText("点名"); // 导入后首选班级也要重置文案
        }
        setIsSwitchOpen(false);
        e.target.value = "";
    };

    const hasData = Object.keys(classMap).length > 0;

    return (
        <div className="app-body" onClick={() => setPunishMap(prev => ({
            ...prev, [currentClass]: { ...currentPunish, isActive: false }
        }))}>
            <input type="file" ref={fileInputRef} hidden multiple onChange={handleImport} accept=".xlsx,.xls,.csv" />
            <BgBackground bgNames={bgNames} />

            {hasData && (
                <>
                    <div className="class-title" onClick={(e) => { e.stopPropagation(); setIsSwitchOpen(true); }}>
                        {currentClass || "请选择班级"} <span className="switch-hint">切换班级</span>
                    </div>
                    <HistoryPanel
                        calledList={recordMap[currentClass] || []}
                        onRecover={(index) => {
                            const list = [...(recordMap[currentClass] || [])];
                            const [p] = list.splice(index, 1);
                            setRecordMap(prev => ({ ...prev, [currentClass]: list }));
                            setClassMap(prev => ({ ...prev, [currentClass]: [p, ...(prev[currentClass] || [])] }));
                            setRollBtnText("点名"); // 修复：退回同学重置文案
                        }}
                    />
                    <AdminControls
                        onImport={() => fileInputRef.current?.click()}
                        onEditPunish={() => setIsEditPunishOpen(true)}
                        onClearHistory={() => {
                            if (window.confirm("确定重置历史？")) {
                                const remaining = classMap[currentClass] || [];
                                const called = recordMap[currentClass] || [];
                                setClassMap(prev => ({ ...prev, [currentClass]: [...remaining, ...called] }));
                                setRecordMap(prev => ({ ...prev, [currentClass]: [] }));
                                setRollBtnText("点名"); // 修复：清空历史重置文案
                                setPunishMap(prev => ({ ...prev, [currentClass]: { count: 0, text: "", isActive: false } }));
                            }
                        }}
                        onDeleteClass={() => {
                            if (window.confirm("确定删除班级？")) {
                                const newM = { ...classMap }; delete newM[currentClass];
                                const nextKeys = Object.keys(newM);
                                const next = nextKeys.length > 0 ? nextKeys[0] : "";
                                setClassMap(newM);
                                setCurrentClass(next);
                                setRollBtnText("点名"); // 修复：删除班级重置文案
                            }
                        }}
                        onResetSystem={() => { if (window.confirm("全部重置？")) { localStorage.clear(); window.location.reload(); } }}
                    />
                </>
            )}

            <div className="container">
                {!hasData ? (
                    <div className="empty-state">
                        <div className="empty-icon">📂</div>
                        <h2>暂无班级名单</h2>
                        <p>请点击下方按钮导入 Excel/CSV 文件开始点名</p>
                        <p className="detail-hint">
                            表格要求：文件名称即为班级名称，支持多文件同时导入。<br />
                            内容格式：第一列为学生姓名，第二列为权重（可选）。
                        </p>
                        <p className="ps-hint">
                            PS：权重默认不填为 1，数值越高被抽到的概率越大。
                        </p>
                        <button
                            className="big-import-btn"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ color: "white" }}
                        >
                            导入班级名单
                        </button>
                    </div>
                ) : (
                    <div className="main-stage">
                        <RollZone
                            currentPunish={currentPunish}
                            activeSubject={activeSubject}
                            setActiveSubject={setActiveSubject}
                            rollBtnText={rollBtnText}
                            onRoll={handleRoll}
                            onPunish={handlePunish}
                            hasCalledHistory={(recordMap[currentClass] || []).length > 0}
                        />
                        <PunishDisplay
                            isActive={currentPunish.isActive}
                            currentPunish={currentPunish}
                            activeSubject={activeSubject}
                            onRetry={handlePunish}
                            onClose={() => setPunishMap(prev => ({
                                ...prev,
                                [currentClass]: { ...currentPunish, isActive: false }
                            }))}
                        />

                    </div>
                )}
            </div>

            <ClassSelector
                isOpen={isSwitchOpen}
                onClose={() => setIsSwitchOpen(false)}
                classMap={classMap}
                currentClass={currentClass}
                onSelectClass={(cls) => {
                    setCurrentClass(cls);
                    setRollBtnText("点名"); // 修复：切换班级重置文案
                }}
            />
            <PunishEditor key={isEditPunishOpen ? "1" : "0"} isOpen={isEditPunishOpen} onClose={() => setIsEditPunishOpen(false)} punishData={punishData} onSave={setPunishData} />
        </div>
    );
};

export default App;
