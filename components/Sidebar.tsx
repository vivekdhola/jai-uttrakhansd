
import React from 'react';
import { Tool } from '../types';
import { HomeIcon, LogoIcon, LogoutIcon } from './IconComponents';

interface SidebarProps {
  tools: Tool[];
  selectedTool: Tool | null;
  onSelectTool: (tool: Tool) => void;
  onGoHome: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tools, selectedTool, onSelectTool, onGoHome, onLogout }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-full">
      <div 
        className="p-6 border-b flex items-center space-x-3 cursor-pointer"
        onClick={onGoHome}
      >
        <LogoIcon className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-dark">
            Jai Uttrakhand
        </h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
            !selectedTool
              ? 'bg-primary text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HomeIcon className="w-6 h-6" />
          <span className="font-semibold">Dashboard</span>
        </a>
        <div className="pt-4">
          <h2 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">All Tools</h2>
          <div className="mt-2 space-y-1">
            {tools.map((tool) => (
              <a
                key={tool.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTool(tool);
                }}
                className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors text-sm ${
                  selectedTool?.id === tool.id
                    ? 'bg-primary text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tool.icon className="w-5 h-5" />
                <span>{tool.title}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
      <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-md transition-colors text-slate-600 hover:bg-slate-100"
          >
            <LogoutIcon className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
