import React from 'react';
import type { Student } from '../../types';

interface HistoryPanelProps {
    calledList: Student[];
    onRecover: (index: number) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ calledList, onRecover }) => {
    return (
        <div className="history-panel" onClick={(e) => e.stopPropagation()}>
            <div className="history-title">已点同学({calledList.length})</div>
            <div className="history-list">
                {calledList.map((stu, index) => (
                    <div key={index} className="history-item">
                        <span>{stu.name}</span>
                        <span
                            className="del-btn"
                            title="退回名单"
                            onClick={() => onRecover(index)}
                        >
                            ×
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPanel;
