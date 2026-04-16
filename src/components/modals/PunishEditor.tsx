import React, { useState } from 'react';
import type { PunishData } from '../../types';
import { SUBJECTS } from '../../constants/subjects';
import { parsePunishText } from '../../utils/format';

interface PunishEditorProps {
    isOpen: boolean;
    onClose: () => void;
    punishData: PunishData;
    onSave: (newData: PunishData) => void;
}

const PunishEditor: React.FC<PunishEditorProps> = ({
    isOpen,
    onClose,
    punishData,
    onSave,
}) => {
    const [tempText, setTempText] = useState(() => {
        let text = "综合：\n" + (punishData["综合"] || []).join("\n");
        SUBJECTS.forEach((sub) => {
            const list = punishData[sub] || [];
            if (list.length > 0) {
                text += `\n\n${sub}：\n` + list.join("\n");
            }
        });
        return text;
    });

    if (!isOpen) return null;

    const handleInternalSave = () => {
        const newData = parsePunishText(tempText);
        onSave(newData);
        onClose();
    };

    return (
        <div className="class-selector-mask" onClick={onClose}>
            <div className="class-selector-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
                <div className="selector-header">
                    <h3>编辑惩罚库</h3>
                    <div className="close-x" onClick={onClose}>×</div>
                </div>
                <p style={{ color: "#666", fontSize: "12px", marginBottom: "10px" }}>
                    格式示例：<br />
                    综合：<br />深蹲10个<br /><br />
                    语文：<br />背诵课文
                </p>
                <textarea
                    className="punish-textarea"
                    value={tempText}
                    onChange={(e) => setTempText(e.target.value)}
                    rows={15}
                    style={{
                        width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #ddd",
                        fontSize: "14px", lineHeight: "1.6", outline: "none", resize: "none", color: "#333"
                    }}
                />
                <button
                    onClick={handleInternalSave}
                    style={{
                        background: "#27ae60", color: "white", fontSize: "16px", width: "100%", lineHeight: "0px",
                        marginTop: "15px", height: "44px", borderRadius: "8px", border: "none", cursor: "pointer"
                    }}
                >
                    保存配置
                </button>
            </div>
        </div>
    );
};

export default PunishEditor;
