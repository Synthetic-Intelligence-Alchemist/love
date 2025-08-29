
import React, { useEffect, RefObject } from 'react';
import { VideoSource } from '../types';

interface VideoFeedProps {
    source: VideoSource;
    videoRef: RefObject<HTMLVideoElement>;
}

const PlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-rose-300" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);


const VideoFeed: React.FC<VideoFeedProps> = ({ source, videoRef }) => {
    useEffect(() => {
        const currentVideo = videoRef.current;
        let stream: MediaStream | null = null;

        const getMedia = async () => {
            try {
                if (source === VideoSource.NONE) {
                    if (currentVideo && currentVideo.srcObject) {
                       (currentVideo.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                       currentVideo.srcObject = null;
                    }
                    return;
                }

                const constraints = source === VideoSource.CAMERA
                    ? { video: { facingMode: 'user' }, audio: false }
                    : { video: true, audio: false };
                
                stream = source === VideoSource.CAMERA
                    ? await navigator.mediaDevices.getUserMedia(constraints)
                    : await navigator.mediaDevices.getDisplayMedia(constraints);
                
                if (currentVideo) {
                    currentVideo.srcObject = stream;
                }

            } catch (err) {
                console.error("Error accessing media devices.", err);
            }
        };

        getMedia();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
            if (currentVideo) {
                currentVideo.srcObject = null;
            }
        };
    }, [source, videoRef]);

    return (
        <div className="aspect-video w-full bg-rose-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
            {source === VideoSource.NONE ? (
                 <div className="flex flex-col items-center text-rose-500">
                    <PlaceholderIcon />
                    <span className="mt-2 text-sm">Video is off</span>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                ></video>
            )}
        </div>
    );
};

export default VideoFeed;
