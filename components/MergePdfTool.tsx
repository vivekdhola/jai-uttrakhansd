
import React, { useState, useRef } from 'react';
import { Tool } from '../types';

interface MergePdfToolProps {
  tool: Tool;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-slate-600">Merging your PDFs...</p>
    </div>
);

const MergePdfTool: React.FC<MergePdfToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };
  
  const handleMerge = () => {
    if (files.length < 2) {
      alert("Please select at least two PDF files to merge.");
      return;
    }
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
        setIsLoading(false);
        setIsMerged(true);
    }, 2000);
  };
  
  const resetState = () => {
    setFiles([]);
    setIsLoading(false);
    setIsMerged(false);
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
      
      {isLoading && <LoadingSpinner />}
      
      {isMerged && !isLoading && (
        <div className="text-center p-8 border-2 border-dashed border-green-400 bg-green-50 rounded-lg animate-fade-in">
            <h3 className="text-2xl font-semibold text-green-800 mb-4">Merge Successful!</h3>
            <p className="text-slate-600 mb-6">Your PDF files have been combined into a single document.</p>
            <button
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
            >
              Download Merged PDF
            </button>
             <button
                onClick={resetState}
                className="mt-4 w-full text-primary hover:underline"
              >
                Merge More PDFs
            </button>
        </div>
      )}

      {!isLoading && !isMerged && (
        <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <p className="mb-4 text-slate-500">Select multiple PDF files to combine them.</p>
                <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Select PDF files
                </button>
            </div>

            {files.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-dark mb-2">Files to Merge ({files.length})</h3>
                    <ul className="space-y-2 bg-slate-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                        {files.map((file, index) => (
                            <li key={index} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm">
                                <span className="text-slate-700 truncate">{file.name}</span>
                                <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {files.length > 1 && (
                 <button
                    onClick={handleMerge}
                    className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 bg-red-600 hover:bg-red-700"
                >
                    Merge PDFs
                </button>
            )}
        </div>
      )}
    </div>
  );
};

export default MergePdfTool;
