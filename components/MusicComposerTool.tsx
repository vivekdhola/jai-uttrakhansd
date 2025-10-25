
import React, { useState } from 'react';
import { Tool } from '../types';
import { composeMusic } from '../services/geminiService';
import { INSTRUMENTS } from '../constants';

interface MusicComposerToolProps {
  tool: Tool;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-slate-600">The AI is composing your music...</p>
    </div>
);

const MusicComposerTool: React.FC<MusicComposerToolProps> = ({ tool }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [composition, setComposition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInstrumentToggle = (instrument: string) => {
    setSelectedInstruments(prev => 
      prev.includes(instrument) 
        ? prev.filter(i => i !== instrument)
        : [...prev, instrument]
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe the music you want to create.');
      return;
    }
    if (selectedInstruments.length === 0) {
        setError('Please select at least one instrument.');
        return;
    }
    setIsLoading(true);
    setError('');
    setComposition('');
    try {
      const result = await composeMusic(prompt, selectedInstruments);
      setComposition(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(composition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const resetState = () => {
    setPrompt('');
    setComposition('');
    setSelectedInstruments([]);
    setError('');
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
      
      {!composition && !isLoading && (
        <div className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-lg font-semibold text-dark mb-2">
              Describe your musical idea
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A mysterious and melancholic theme for a rainy night in a city"
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>
          <div>
            <h3 className="block text-lg font-semibold text-dark mb-3">Select your instruments</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {INSTRUMENTS.map(instrument => (
                <label key={instrument} className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${selectedInstruments.includes(instrument) ? 'bg-primary border-primary text-white' : 'border-slate-300 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={selectedInstruments.includes(instrument)}
                    onChange={() => handleInstrumentToggle(instrument)}
                    className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary-dark"
                  />
                  <span className="font-medium">{instrument}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim() || selectedInstruments.length === 0}
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-primary hover:bg-primary-dark disabled:bg-slate-300"
          >
            {isLoading ? 'Composing...' : 'Compose Music'}
          </button>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {error && !isLoading && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {composition && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-2xl font-semibold text-dark mb-4">Your Musical Composition</h3>
          <div className="relative">
            <div className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-lg overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                {composition}
            </div>
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
            Compose Another Piece
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicComposerTool;
