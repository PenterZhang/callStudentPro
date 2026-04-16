import React from 'react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children, maxWidth }) => {
    if (!isOpen) return null;
    return (
        <div className="class-selector-mask" onClick={onClose}>
            <div className="class-selector-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth }}>
                <div className="selector-header">
                    <h3>{title}</h3>
                    <div className="close-x" onClick={onClose}>×</div>
                </div>
                {children}
            </div>
        </div>
    );
};

export default BaseModal;
