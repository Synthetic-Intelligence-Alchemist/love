
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

// FIX: Add Web Speech API type definitions to resolve TypeScript errors.
// These are not available in standard DOM typings and are needed for speech recognition to work with TypeScript.
interface SpeechRecognitionAlternative {
    readonly transcript: string;
}
  
interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    [index: number]: SpeechRecognitionAlternative;
}
  
interface SpeechRecognitionResultList {
    readonly length: number;
    [index: number]: SpeechRecognitionResult;
}
  
interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}
  
interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
}
  
export interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    onresult: (event: SpeechRecognitionEvent) => void;
    onstart: () => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    start(): void;
    stop(): void;
}
  
interface SpeechRecognitionStatic {
    new (): SpeechRecognition;
}
  
declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}
