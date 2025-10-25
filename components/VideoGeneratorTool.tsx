

import React, { useState, useEffect, useRef } from 'react';
import { Tool } from '../types';
import { generateVideoFromImage, getVideoGenerationOperation } from '../services/geminiService';
// FIX: Import ImageIcon component.
import { ImageIcon } from './IconComponents';

// FIX: Removed redundant 'declare global' which caused type conflicts with the execution environment.
// The 'aistudio' object on the window is expected to be globally available.

interface VideoGeneratorToolProps {
  tool: Tool;
}

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center space-y-4 my-8">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-slate-600 text-center">{message}</p>
    </div>
);

const VideoGeneratorTool: React.FC<VideoGeneratorToolProps> = ({ tool }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [apiKeySelected, setApiKeySelected] = useState<boolean | null>(null);

  const pollingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    checkApiKey();
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);
  
  const checkApiKey = async () => {
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
    } else {
        // Fallback for when aistudio is not available
        setApiKeySelected(true); 
    }
  };

  const handleSelectKey = async () => {
      if (window.aistudio) {
          await window.aistudio.openSelectKey();
          // Assume success and let the API call handle potential failure
          setApiKeySelected(true);
      }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const pollOperation = async (operation: any) => {
    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        const updatedOperation = await getVideoGenerationOperation(operation);
        if (updatedOperation.done) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          setLoadingMessage('Finalizing video...');
          const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
          if (downloadLink) {
             const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
             const blob = await response.blob();
             const url = URL.createObjectURL(blob);
             setVideoUrl(url);
          } else {
              throw new Error("Video generation completed, but no video URI was found.");
          }
          setIsLoading(false);
        } else {
            setLoadingMessage('AI is generating the video... This can take a few minutes.');
        }
      } catch (err: any) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        setError(err.message || "An error occurred while polling for video status.");
        setIsLoading(false);
      }
    }, 10000);
  };
  
  const handleGenerate = async () => {
    if (!prompt.trim() || !imageFile) {
      setError('Please provide an image and a text prompt.');
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage('Initializing video generation...');
    setError('');
    setVideoUrl(null);

    try {
      const operation = await generateVideoFromImage(prompt, imageFile, aspectRatio);
      setLoadingMessage('Video generation started. Please wait...');
      pollOperation(operation);
    } catch (err: any) {
      if (err.message.includes("API Key is invalid")) {
          setApiKeySelected(false);
      }
      setError(err.message || 'An unknown error occurred during generation.');
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setPrompt('');
    setImageFile(null);
    setImagePreview(null);
    setVideoUrl(null);
    setError('');
    setIsLoading(false);
  };

  if (apiKeySelected === null) {
      return <div className="max-w-3xl mx-auto text-center"><p>Checking API key status...</p></div>;
  }
  
  if (!apiKeySelected) {
    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl text-center">
             <h2 className="text-2xl font-bold text-dark mb-4">API Key Required</h2>
             <p className="text-slate-600 mb-6">This tool uses the Veo video generation model, which requires you to select an API key. Please select a key to continue.</p>
             <p className="text-sm text-slate-500 mb-6">For information on billing, please visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary underline">ai.google.dev/gemini-api/docs/billing</a>.</p>
             <button
                onClick={handleSelectKey}
                className="w-full max-w-sm mx-auto text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-primary hover:bg-primary-dark"
            >
                Select API Key
            </button>
        </div>
    );
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
      
      {!videoUrl && !isLoading && (
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-dark mb-2">1. Upload a starting image</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
              <div className="text-center">
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md"/>
                ) : (
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-slate-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-dark focus-within:ring-offset-2 hover:text-primary-dark">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-slate-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-lg font-semibold text-dark mb-2">
              2. Describe what should happen in the video
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., The camera slowly zooms in, cinematic lighting"
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>
          <div>
            <h3 className="block text-lg font-semibold text-dark mb-3">3. Choose an aspect ratio</h3>
            <div className="flex space-x-4">
              <label className={`flex-1 p-4 border rounded-lg cursor-pointer text-center ${aspectRatio === '16:9' ? 'border-primary ring-2 ring-primary' : 'border-slate-300'}`}>
                <input type="radio" name="aspectRatio" value="16:9" checked={aspectRatio === '16:9'} onChange={() => setAspectRatio('16:9')} className="sr-only" />
                <span className="font-bold">16:9</span>
                <span className="block text-sm text-slate-500">Landscape</span>
              </label>
              <label className={`flex-1 p-4 border rounded-lg cursor-pointer text-center ${aspectRatio === '9:16' ? 'border-primary ring-2 ring-primary' : 'border-slate-300'}`}>
                <input type="radio" name="aspectRatio" value="9:16" checked={aspectRatio === '9:16'} onChange={() => setAspectRatio('9:16')} className="sr-only" />
                <span className="font-bold">9:16</span>
                <span className="block text-sm text-slate-500">Portrait</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim() || !imageFile}
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-primary hover:bg-primary-dark disabled:bg-slate-300"
          >
            {isLoading ? 'Generating...' : 'Generate Video'}
          </button>
        </div>
      )}

      {isLoading && <LoadingSpinner message={loadingMessage} />}
      
      {error && !isLoading && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {videoUrl && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-2xl font-semibold text-dark mb-4 text-center">Your Generated Video</h3>
          <div className="relative bg-slate-100 rounded-lg overflow-hidden">
            <video src={videoUrl} controls autoPlay loop className="w-full h-auto" />
          </div>
           <button
            onClick={resetState}
            className="mt-6 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300"
          >
            Create Another Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoGeneratorTool;
