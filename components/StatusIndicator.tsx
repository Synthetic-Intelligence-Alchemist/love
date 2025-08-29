
import React from 'react';
import { Status } from '../types';

interface StatusIndicatorProps {
    status: Status;
    error: string | null;
}

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-800 mr-2"></div>
);

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, error }) => {
    const getStatusContent = () => {
        if (status === Status.ERROR) {
            return (
                <div className="w-full p-3 text-sm text-center bg-red-100 text-red-700 border border-red-200 rounded-lg">
                    <strong>Error:</strong> {error || 'An unknown error occurred.'}
                </div>
            );
        }

        let text = 'Ready';
        let showSpinner = false;

        switch (status) {
            case Status.LISTENING:
                text = 'Listening...';
                break;
            case Status.TRANSLATING:
                text = 'Translating...';
                showSpinner = true;
                break;
            case Status.SPEAKING:
                text = 'Speaking...';
                showSpinner = true;
                break;
            case Status.IDLE:
                 text = 'Ready to translate';
                 break;
            default:
                text = 'Ready';
        }

        return (
             <div className="w-full p-3 text-center bg-rose-200/70 text-rose-800 rounded-lg flex items-center justify-center">
                {showSpinner && <LoadingSpinner />}
                <span>{text}</span>
            </div>
        )
    };

    return <div className="h-16 flex items-center justify-center">{getStatusContent()}</div>;
};

export default StatusIndicator;
