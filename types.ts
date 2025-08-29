
export enum VideoSource {
    NONE = 'none',
    CAMERA = 'camera',
    SCREEN = 'screen',
}

export enum Status {
    IDLE = 'idle',
    LISTENING = 'listening',
    TRANSLATING = 'translating',
    SPEAKING = 'speaking',
    ERROR = 'error',
}

export interface Message {
    id: number;
    original: string;
    translation: string;
    language: string; // Could be expanded to be more specific later
}

export enum Language {
    EN = 'en-US',
    ES = 'es-ES',
}
