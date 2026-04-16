import React from 'react';
import { SUBJECTS } from '../../constants/subjects';
import type { PunishStatus } from '../../types';

interface RollZoneProps {
    currentPunish: PunishStatus;
    activeSubject: string;
    setActiveSubject: (subject: string) => void;
    rollBtnText: string;
    onRoll: (e: React.MouseEvent) => void;
    onPunish: (e: React.MouseEvent) => void;
    hasCalledHistory: boolean;
}

const RollZone: React.FC<RollZoneProps> = ({
    currentPunish,
    activeSubject,
    setActiveSubject,
    rollBtnText,
    onRoll,
    onPunish,
    hasCalledHistory
}) => {
    const getPunishBtnText = () => {
        if (currentPunish.count >= 2) return currentPunish.isActive ? "最终结果" : "查看惩罚";
        return currentPunish.count === 1 ? "再抽一次" : "惩罚";
    };

    return (
        <div className="roll-zone-container">
            <div
                className={`roll-zone ${currentPunish.isActive ? "dimmed" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="subject-tabs">
                    {SUBJECTS.map((s) => (
                        <div
                            key={s}
                            className={`tab ${activeSubject === s ? "active" : ""}`}
                            onClick={() => setActiveSubject(s)}
                        >
                            {s}
                        </div>
                    ))}
                </div>

                <button id="rollBtn" onClick={onRoll}>{rollBtnText}</button>
                <br />
                {hasCalledHistory && (
                    <button
                        id="punishBtn"
                        onClick={onPunish}
                        disabled={currentPunish.count >= 2 && currentPunish.isActive}
                        style={{ position: 'relative' }}
                    >
                        {getPunishBtnText()}
                        {currentPunish.count > 0 && currentPunish.count < 2 && (
                            <span
                                className="view-punish-hint"
                                onClick={(e) => onPunish(e)} // 这里不需要单独写逻辑，直接透传给 handlePunish 即可
                            >
                                查看记录
                            </span>
                        )}
                    </button>

                )}
            </div>
        </div>
    );
};

export default RollZone;
