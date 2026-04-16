export interface Student {
    name: string;
    weight: number;
}

export interface BgName {
    id: number;
    name: string;
    left: string;
    top: string;
    fontSize: string;
    opacity: string;
}

export interface ClassData {
    [className: string]: Student[];
}

export interface PunishStatus {
    count: number;
    text: string;
    isActive: boolean;
}

export interface PunishMap {
    [className: string]: PunishStatus;
}

export interface PunishData {
    [subject: string]: string[];
}

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}
