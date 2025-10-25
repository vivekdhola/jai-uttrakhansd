import React, { useState } from 'react';
import { Tool } from '../types';
import { generateImage } from '../services/geminiService';

interface ImageGeneratorToolProps {
  tool: Tool;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-slate-600">The AI is creating your image...</p>
    </div>
);

const ImageGeneratorTool: React.FC<ImageGeneratorToolProps> = ({ tool }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setIsLoading(true);
    setError('');
    setImageUrl('');
    try {
      const result = await generateImage(prompt);
      setImageUrl(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setPrompt('');
    setImageUrl('');
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
      
      {!imageUrl && !isLoading && (
        <div className="space-y-4">
          <label htmlFor="prompt" className="block text-lg font-semibold text-dark">
            Describe the image you want to create:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., An astronaut riding a horse on Mars, cinematic lighting"
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-primary hover:bg-primary-dark disabled:bg-slate-300"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {error && !isLoading && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {imageUrl && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-2xl font-semibold text-dark mb-4">Your Generated Image</h3>
          <div className="relative bg-slate-100 rounded-lg overflow-hidden">
            <img src={imageUrl} alt={prompt} className="w-full h-auto object-contain" />
          </div>
           <button
            onClick={resetState}
            className="mt-4 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300"
          >
            Create Another Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGeneratorTool;