
import React from 'react';
import { Message } from '../types';

interface ConversationLogProps {
    messages: Message[];
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    return (
        <div className="mb-6 animate-fade-in">
            <div className="bg-rose-100 rounded-xl rounded-bl-none p-4 max-w-xl shadow-sm">
                <p className="text-gray-700">{message.original}</p>
            </div>
            <div className="bg-rose-700 text-white rounded-xl rounded-br-none p-4 max-w-xl ml-auto mt-2 shadow-md">
                <p className="font-medium">{message.translation}</p>
            </div>
        </div>
    );
};


const ConversationLog: React.FC<ConversationLogProps> = ({ messages }) => {
    return (
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h2 className="text-xl font-semibold">Conversation is empty</h2>
                    <p className="mt-2 max-w-sm">Press the microphone to start speaking or type a message below. Your translated conversation will appear here.</p>
                </div>
            ) : (
                messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
            )}
        </div>
    );
};

export default ConversationLog;
