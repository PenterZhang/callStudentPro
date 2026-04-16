import React from 'react';
import type { BgName } from '../../types';

interface BgBackgroundProps {
    bgNames: BgName[];
}

const BgBackground: React.FC<BgBackgroundProps> = ({ bgNames }) => {
    return (
        <>
            {bgNames.map((n) => (
                <div
                    key={n.id}
                    className="name"
                    style={{
                        left: n.left,
                        top: n.top,
                        fontSize: n.fontSize,
                        opacity: n.opacity,
                    }}
                >
                    {n.name}
                </div>
            ))}
        </>
    );
};

export default BgBackground;
