import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(tool)}
      className="group flex flex-col items-center justify-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-t-4 border-transparent hover:border-primary"
    >
      <div className={`p-4 rounded-full text-white transition-colors duration-300 ${tool.color}`}>
        <tool.icon className="w-10 h-10" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-dark">{tool.title}</h3>
      <p className="mt-2 text-slate-500 text-sm">{tool.description}</p>
    </div>
  );
};

export default ToolCard;