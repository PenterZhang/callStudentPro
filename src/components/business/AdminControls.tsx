import React from 'react';

interface AdminControlsProps {
    onImport: () => void;
    onEditPunish: () => void;
    onClearHistory: () => void;
    onDeleteClass: () => void;
    onResetSystem: () => void;
}

const AdminControls: React.FC<AdminControlsProps> = ({
    onImport,
    onEditPunish,
    onClearHistory,
    onDeleteClass,
    onResetSystem
}) => {
    return (
        <div className="admin-controls" onClick={(e) => e.stopPropagation()}>
            <button onClick={onImport} style={{ background: "#27ae60" }}>导入班级</button>
            <button onClick={onEditPunish} style={{ background: "#f39c12" }}>编辑惩罚</button>
            <button onClick={onClearHistory}>清空历史</button>
            <button onClick={onDeleteClass} style={{ background: "#eb4d4b" }}>删除班级</button>
            <button onClick={onResetSystem} style={{ background: "#d63031" }}>重置系统</button>
        </div>
    );
};

export default AdminControls;
