import React from 'react';
import type { PunishStatus } from '../../types';

interface PunishDisplayProps {
    isActive: boolean;
    currentPunish: PunishStatus;
    activeSubject: string;
    onRetry: (e: React.MouseEvent) => void;
    onClose: () => void;
}

const PunishDisplay: React.FC<PunishDisplayProps> = ({
    isActive,
    currentPunish,
    activeSubject,
    onRetry,
    onClose
}) => {
    if (!isActive) return null;

    return (
        <div id="punishDisplay" onClick={(e) => e.stopPropagation()}>
            <div className="punish-label">{activeSubject}惩罚内容</div>
            <div className="punish-content">{currentPunish.text}</div>
            <div className="punish-footer">
                {currentPunish.count < 2 ? (
                    <button className="retry-punish-btn" onClick={onRetry}>
                        再抽一次
                    </button>
                ) : (
                    <div className="punish-tip-final" style={{ marginTop: "25px", color: "#ff4757", fontWeight: "bold" }}>
                        🚩命中注定，不可更改
                    </div>
                )}
                <div
                    className="close-tip"
                    onClick={onClose}
                    style={{ marginTop: "15px", cursor: "pointer", opacity: 0.6, fontSize: "12px" }}
                >
                    点击背景收起
                </div>
            </div>
        </div>
    );
};

export default PunishDisplay;
