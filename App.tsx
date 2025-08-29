
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VideoSource, Status, Message, Language } from './types';
import { translateTextAndImage } from './services/geminiService';
import VideoFeed from './components/VideoFeed';
import ConversationLog from './components/ConversationLog';
import ControlPanel from './components/ControlPanel';
import StatusIndicator from './components/StatusIndicator';
import { SYSTEM_INSTRUCTION } from './constants';

const App: React.FC = () => {
    const [videoSource, setVideoSource] = useState<VideoSource>(VideoSource.NONE);
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const conversationEndRef = useRef<HTMLDivElement>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const speak = useCallback((text: string, lang: Language) => {
        if (!window.speechSynthesis) return;
        setStatus(Status.SPEAKING);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(voice => voice.lang === lang);

        if (!selectedVoice) {
            if (lang === Language.ES) {
                selectedVoice = voices.find(voice => voice.lang.startsWith('es-'));
            } else if (lang === Language.EN) {
                selectedVoice = voices.find(voice => voice.lang.startsWith('en-'));
            }
        }
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = () => setStatus(Status.IDLE);
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setError("Sorry, I couldn't speak the translation.");
            setStatus(Status.ERROR);
        };
        window.speechSynthesis.speak(utterance);
    }, []);

    const handleTranslate = useCallback(async (text: string) => {
        if (!text.trim()) return;

        setStatus(Status.TRANSLATING);
        setError(null);
        let frameData: string | null = null;

        if (videoSource !== VideoSource.NONE && videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                frameData = canvas.toDataURL('image/jpeg').split(',')[1];
            }
        }
        
        const originalMessage: Message = { id: Date.now(), original: text, translation: '...', language: 'en' };
        setMessages(prev => [...prev, originalMessage]);
        
        try {
            const translation = await translateTextAndImage(text, frameData, SYSTEM_INSTRUCTION);
            
            const isSpanish = (/[áéíóúñ¿¡]/i.test(translation)) || translation.split(' ').length > text.split(' ').length;
            const targetLang = isSpanish ? Language.ES : Language.EN;
            
            setMessages(prev => prev.map(m => m.id === originalMessage.id ? { ...m, translation } : m));
            speak(translation, targetLang);
        } catch (err) {
            console.error(err);
            const errorMessage = (err as Error).message;
            setError(`Translation failed: ${errorMessage}`);
            setStatus(Status.ERROR);
            setMessages(prev => prev.map(m => m.id === originalMessage.id ? { ...m, translation: 'Translation Failed' } : m));
        }
    }, [videoSource, speak]);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setStatus(Status.LISTENING);
            } catch (e) {
                console.info("Recognition already started.");
            }
        }
    }, []);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in this browser.");
            setStatus(Status.ERROR);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        let finalTranscript = '';

        recognition.onresult = (event) => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript.trim()) {
                handleTranslate(finalTranscript.trim());
                finalTranscript = ''; 
            }

            silenceTimerRef.current = setTimeout(() => {
                if(interimTranscript.trim()){
                    handleTranslate(interimTranscript.trim());
                }
            }, 1500);
        };

        recognition.onstart = () => setStatus(Status.LISTENING);
        recognition.onend = () => {
            if (status === Status.LISTENING) {
                // If it stopped unexpectedly, restart it
                startListening();
            }
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setError(`Speech recognition error: ${event.error}`);
            setStatus(Status.ERROR);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
            recognitionRef.current = null;
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [handleTranslate, status, startListening]);

    const handleMicClick = () => {
        if (status === Status.LISTENING) {
            recognitionRef.current?.stop();
            setStatus(Status.IDLE);
        } else {
            startListening();
        }
    };
    
    const handleTextSubmit = (text: string) => {
      if (status !== Status.TRANSLATING) {
        handleTranslate(text);
      }
    };

    return (
        <div className="bg-rose-50 min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 selection:bg-rose-300 selection:text-rose-900">
            <div className="w-full max-w-6xl h-[95vh] bg-white rounded-3xl shadow-2xl shadow-rose-200 flex overflow-hidden border-4 border-white">
                {/* Left Panel: Video and Controls */}
                <div className="w-1/3 bg-rose-100 flex flex-col p-6 space-y-6 border-r border-rose-200">
                    <header className="text-center">
                        <h1 className="text-4xl font-serif font-bold text-rose-800">Love Language</h1>
                        <p className="text-rose-600 mt-1">Real-time Conversation Translator</p>
                    </header>
                    <VideoFeed source={videoSource} videoRef={videoRef} />
                    <StatusIndicator status={status} error={error} />
                    <ControlPanel
                        status={status}
                        videoSource={videoSource}
                        onMicClick={handleMicClick}
                        onVideoSourceChange={setVideoSource}
                        onTextSubmit={handleTextSubmit}
                    />
                </div>

                {/* Right Panel: Conversation */}
                <div className="w-2/3 flex flex-col">
                    <ConversationLog messages={messages} />
                    <div ref={conversationEndRef} />
                </div>
            </div>
        </div>
    );
};

export default App;
