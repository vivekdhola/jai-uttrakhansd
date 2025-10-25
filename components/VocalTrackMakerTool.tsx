import React, { useState, useEffect } from 'react';
import { Tool } from '../types';
import { generateVocalTrack, createAudioUrlFromBase64 } from '../services/geminiService';
import { PREBUILT_VOICES } from '../constants';

interface VocalTrackMakerToolProps {
  tool: Tool;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-slate-600">The AI is generating your vocal track...</p>
    </div>
);

const VocalTrackMakerTool: React.FC<VocalTrackMakerToolProps> = ({ tool }) => {
  const [prompt, setPrompt] = useState('Speaker 1: Hello from Jai Uttrakhand!\nSpeaker 2: We are excited to show you our new tool.');
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [speaker1Name, setSpeaker1Name] = useState('Speaker 1');
  const [speaker1Voice, setSpeaker1Voice] = useState(PREBUILT_VOICES[0].id);
  const [speaker2Name, setSpeaker2Name] = useState('Speaker 2');
  const [speaker2Voice, setSpeaker2Voice] = useState(PREBUILT_VOICES[1].id);

  // Clean up the object URL when the component unmounts or the URL changes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !speaker1Name.trim() || !speaker2Name.trim()) {
      setError('Please provide lyrics and names for both speakers.');
      return;
    }
    if (speaker1Name.trim() === speaker2Name.trim()) {
      setError('Speaker names must be different.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAudioUrl('');

    try {
      const speaker1 = { name: speaker1Name, voice: speaker1Voice };
      const speaker2 = { name: speaker2Name, voice: speaker2Voice };
      const base64Audio = await generateVocalTrack(prompt, speaker1, speaker2);
      const url = createAudioUrlFromBase64(base64Audio);
      setAudioUrl(url);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setAudioUrl('');
    setError('');
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`p-3 rounded-full text-white ${tool.color}`}>
          <tool.icon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-dark">{tool.title}</h2>
          <p className="text-slate-500">{tool.description}</p>
        </div>
      </div>
      
      {!audioUrl && !isLoading && (
        <div className="space-y-6">
           <div>
              <label htmlFor="prompt" className="block text-lg font-semibold text-dark mb-2">
                Your Song Lyrics
              </label>
              <p className="text-sm text-slate-500 mb-2">
                Write your lyrics below. Start each line with the speaker's name followed by a colon (e.g., "Alex: Hello world").
              </p>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Speaker 1: ...&#10;Speaker 2: ..."
                className="w-full h-48 p-3 border border-slate-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-slate-200 rounded-lg">
            {/* Speaker 1 Configuration */}
            <div className="space-y-2">
              <h3 className="text-md font-semibold text-dark">Configure Speaker 1</h3>
               <input
                type="text"
                value={speaker1Name}
                onChange={(e) => setSpeaker1Name(e.target.value)}
                placeholder="e.g., Singer A"
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <select 
                value={speaker1Voice} 
                onChange={e => setSpeaker1Voice(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              >
                {PREBUILT_VOICES.map(voice => <option key={voice.id} value={voice.id}>{voice.name}</option>)}
              </select>
            </div>
            
            {/* Speaker 2 Configuration */}
            <div className="space-y-2">
                <h3 className="text-md font-semibold text-dark">Configure Speaker 2</h3>
                <input
                    type="text"
                    value={speaker2Name}
                    onChange={(e) => setSpeaker2Name(e.target.value)}
                    placeholder="e.g., Singer B"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <select 
                    value={speaker2Voice} 
                    onChange={e => setSpeaker2Voice(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                    {PREBUILT_VOICES.map(voice => <option key={voice.id} value={voice.id}>{voice.name}</option>)}
                </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-primary hover:bg-primary-dark disabled:bg-slate-300"
          >
            {isLoading ? 'Generating...' : 'Create Vocal Track'}
          </button>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {error && !isLoading && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {audioUrl && (
        <div className="mt-6 animate-fade-in text-center">
          <h3 className="text-2xl font-semibold text-dark mb-4">Your Vocal Track is Ready!</h3>
          <audio controls src={audioUrl} className="w-full mx-auto">
            Your browser does not support the audio element.
          </audio>
           <button
            onClick={resetState}
            className="mt-6 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300"
          >
            Create Another Track
          </button>
        </div>
      )}
    </div>
  );
};

export default VocalTrackMakerTool;