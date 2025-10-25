import React, { useState } from 'react';
import { Tool } from '../types';
import { rewriteText } from '../services/geminiService';

interface ContentRewriterToolProps {
  tool: Tool;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-slate-600">The AI is rewriting your content...</p>
    </div>
);

const ContentRewriterTool: React.FC<ContentRewriterToolProps> = ({ tool }) => {
  const [inputText, setInputText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to rewrite.');
      return;
    }
    setIsLoading(true);
    setError('');
    setRewrittenText('');
    try {
      const result = await rewriteText(inputText);
      setRewrittenText(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const resetState = () => {
    setInputText('');
    setRewrittenText('');
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="input-text" className="block text-lg font-semibold text-dark mb-2">Original Text</label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-64 p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading || !!rewrittenText}
          />
        </div>
        <div className="relative">
          <label htmlFor="output-text" className="block text-lg font-semibold text-dark mb-2">Rewritten Text</label>
           {isLoading ? (
             <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-lg"><LoadingSpinner /></div>
           ) : (
            <>
              <textarea
                id="output-text"
                readOnly
                value={rewrittenText}
                placeholder="Your rewritten text will appear here..."
                className="w-full h-64 p-3 border border-slate-200 bg-slate-50 rounded-lg resize-none"
              />
              {rewrittenText && (
                 <button
                    onClick={handleCopy}
                    className="absolute top-12 right-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-1 px-3 rounded-md transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </>
           )}
        </div>
      </div>
      
      {error && !isLoading && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md col-span-2">{error}</div>}

      <div className="mt-6">
        {rewrittenText ? (
            <button
                onClick={resetState}
                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-primary hover:bg-primary-dark"
            >
                Rewrite Another Text
            </button>
        ) : (
            <button
                onClick={handleRewrite}
                disabled={isLoading || !inputText.trim()}
                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-primary hover:bg-primary-dark disabled:bg-slate-300"
            >
                {isLoading ? 'Rewriting...' : 'Rewrite Text'}
            </button>
        )}
      </div>
    </div>
  );
};

export default ContentRewriterTool;