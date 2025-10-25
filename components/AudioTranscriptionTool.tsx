import React, { useState, useRef } from 'react';
import { Tool } from '../types';
import { transcribeAudio } from '../services/geminiService';

interface AudioTranscriptionToolProps {
  tool: Tool;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-slate-600">Gemini is transcribing... This may take a moment.</p>
    </div>
);

const AudioTranscriptionTool: React.FC<AudioTranscriptionToolProps> = ({ tool }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setTranscription('');
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleTranscribe(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Stop microphone access
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please ensure you have given permission.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsLoading(true);
    setError('');
    setTranscription('');

    try {
      const result = await transcribeAudio(blob);
      setTranscription(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetState = () => {
      setTranscription('');
      setError('');
      setIsLoading(false);
      setIsRecording(false);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`p-3 rounded-full text-white ${tool.color}`}>
          <tool.icon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-dark">{tool.title}</h2>
          <p className="text-slate-500">{tool.description}</p>
        </div>
      </div>
      
      {!transcription && !isLoading && (
        <div className="space-y-6 text-center">
            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-300 rounded-lg">
                <p className="text-slate-600 mb-4">
                    {isRecording ? "Recording in progress..." : "Click the button to start recording."}
                </p>
                 <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`relative w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center ${
                    isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'
                    } ${!isRecording ? 'animate-pulse-record' : ''}`}
                >
                    {isRecording ? (
                        <span className="w-8 h-8 bg-white rounded-md"></span>
                    ) : (
                        <tool.icon className="w-10 h-10 text-white" />
                    )}
                </button>
            </div>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {error && !isLoading && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {transcription && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-2xl font-semibold text-dark mb-4">Transcription Result</h3>
          <div className="relative">
            <textarea
              readOnly
              value={transcription}
              className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Transcription Result"
            />
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-1 px-3 rounded-md transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
           <button
            onClick={resetState}
            className="mt-4 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300"
          >
            Transcribe Another Audio
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioTranscriptionTool;