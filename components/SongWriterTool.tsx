import React, { useState } from 'react';
import { Tool } from '../types';
import { generateSongLyrics } from '../services/geminiService';

interface SongWriterToolProps {
  tool: Tool;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-slate-600">The AI is writing your song...</p>
    </div>
);

const SongWriterTool: React.FC<SongWriterToolProps> = ({ tool }) => {
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for your song.');
      return;
    }
    setIsLoading(true);
    setError('');
    setLyrics('');
    try {
      const result = await generateSongLyrics(prompt);
      setLyrics(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const resetState = () => {
    setPrompt('');
    setLyrics('');
    setError('');
  };

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
      
      {!lyrics && !isLoading && (
        <div className="space-y-4">
          <label htmlFor="prompt" className="block text-lg font-semibold text-dark">
            What should the song be about?
          </label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A robot falling in love with a toaster"
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-primary hover:bg-primary-dark disabled:bg-slate-300"
          >
            {isLoading ? 'Generating...' : 'Write My Song'}
          </button>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {error && !isLoading && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {lyrics && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-2xl font-semibold text-dark mb-4">Generated Lyrics</h3>
          <div className="relative">
            <textarea
              readOnly
              value={lyrics}
              className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-lg resize-none font-mono text-sm"
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
            Write Another Song
          </button>
        </div>
      )}
    </div>
  );
};

export default SongWriterTool;