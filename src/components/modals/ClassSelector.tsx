import React from 'react';
import type { ClassData } from '../../types';

interface ClassSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    classMap: ClassData;
    currentClass: string;
    onSelectClass: (className: string) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({
    isOpen,
    onClose,
    classMap,
    currentClass,
    onSelectClass
}) => {
    if (!isOpen) return null;

    return (
        <div className="class-selector-mask" onClick={onClose}>
            <div className="class-selector-content" onClick={(e) => e.stopPropagation()}>
                <div className="selector-header">
                    <h3>切换班级</h3>
                    <div className="close-x" onClick={onClose}>×</div>
                </div>
                <div className="class-grid">
                    {Object.keys(classMap).map((cls) => (
                        <div
                            key={cls}
                            className={`class-card ${cls === currentClass ? "active" : ""}`}
                            onClick={() => {
                                onSelectClass(cls);
                                onClose();
                            }}
                        >
                            <div className="card-name">{cls}</div>
                            <div className="card-count">余{classMap[cls].length}未点名</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassSelector;
