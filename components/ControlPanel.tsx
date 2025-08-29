
import React, { useState } from 'react';
import { Status, VideoSource } from '../types';

interface ControlPanelProps {
    status: Status;
    videoSource: VideoSource;
    onMicClick: () => void;
    onVideoSourceChange: (source: VideoSource) => void;
    onTextSubmit: (text: string) => void;
}

const MicIcon: React.FC<{ listening: boolean }> = ({ listening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors ${listening ? 'text-white' : 'text-rose-700'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 008-8V8a1 1 0 00-2 0v2a6 6 0 11-12 0V8a1 1 0 00-2 0v2a8 8 0 008 8z" clipRule="evenodd" />
    </svg>
);

const VideoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" />
    </svg>
);


const ControlPanel: React.FC<ControlPanelProps> = ({ status, videoSource, onMicClick, onVideoSourceChange, onTextSubmit }) => {
    const [textInput, setTextInput] = useState('');
    const isListening = status === Status.LISTENING;
    const isTranslating = status === Status.TRANSLATING;
    const isSpeaking = status === Status.SPEAKING;
    const isDisabled = isTranslating || isSpeaking;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput.trim() && !isDisabled) {
            onTextSubmit(textInput);
            setTextInput('');
        }
    };

    const sourceOptions = [
        { id: VideoSource.NONE, label: 'Off' },
        { id: VideoSource.CAMERA, label: 'Camera' },
        { id: VideoSource.SCREEN, label: 'Screen' },
    ];
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
                <button
                    onClick={onMicClick}
                    disabled={isDisabled}
                    className={`p-5 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-rose-300 ${isListening ? 'bg-red-500 shadow-lg scale-110 animate-pulse' : 'bg-rose-200 hover:bg-rose-300'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <MicIcon listening={isListening} />
                </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Or type your message..."
                    disabled={isDisabled}
                    className="w-full px-4 py-2 bg-white border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
                />
                <button type="submit" disabled={isDisabled || !textInput.trim()} className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:bg-rose-300 transition">
                   Send
                </button>
            </form>

            <div>
                <label className="text-sm font-medium text-rose-800 flex items-center mb-2"><VideoIcon /> Video Source</label>
                <div className="flex items-center justify-between bg-white border border-rose-200 rounded-lg p-1">
                    {sourceOptions.map(option => (
                        <button
                            key={option.id}
                            onClick={() => onVideoSourceChange(option.id)}
                            className={`w-full text-center py-2 text-sm rounded-md transition-colors ${videoSource === option.id ? 'bg-rose-600 text-white shadow' : 'text-rose-700 hover:bg-rose-100'}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ControlPanel;
