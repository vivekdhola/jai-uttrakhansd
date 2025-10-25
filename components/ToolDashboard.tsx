import React from 'react';
import { Tool } from '../types';
import { TOOLS } from '../constants';
import ToolCard from './ToolCard';

interface ToolDashboardProps {
  onSelectTool: (tool: Tool) => void;
}

const ToolDashboard: React.FC<ToolDashboardProps> = ({ onSelectTool }) => {
  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">Your AI-Powered Creative Suite</h2>
      <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
        Unleash your creativity with a powerful set of AI tools. Write songs, generate images, rewrite content, and chat with an intelligent assistant.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
        ))}
      </div>
    </div>
  );
};

export default ToolDashboard;