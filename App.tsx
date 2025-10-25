
import React, { useState } from 'react';
import { Tool } from './types';
import ToolDashboard from './components/ToolDashboard';
import { TOOLS } from './constants';
import AudioTranscriptionTool from './components/AudioTranscriptionTool';
import Sidebar from './components/Sidebar';
import ImageGeneratorTool from './components/ImageGeneratorTool';
import ContentRewriterTool from './components/ContentRewriterTool';
import ChatbotTool from './components/ChatbotTool';
import SongWriterTool from './components/SongWriterTool';
import VocalTrackMakerTool from './components/VocalTrackMakerTool';
import MusicComposerTool from './components/MusicComposerTool';
import VideoGeneratorTool from './components/VideoGeneratorTool';
import LoginScreen from './components/LoginScreen';
import TermsModal from './components/TermsModal';
import Footer from './components/Footer';
import MergePdfTool from './components/MergePdfTool';

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleGoHome = () => {
    setSelectedTool(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedTool(null); // Reset to dashboard on logout
  };

  const renderToolComponent = () => {
    if (!selectedTool) return null;

    switch (selectedTool.id) {
      case 'pdf-merge':
        return <MergePdfTool tool={selectedTool} />;
      case 'video-generator':
        return <VideoGeneratorTool tool={selectedTool} />;
      case 'song-writer':
        return <SongWriterTool tool={selectedTool} />;
      case 'vocal-track-maker':
        return <VocalTrackMakerTool tool={selectedTool} />;
      case 'music-composer':
        return <MusicComposerTool tool={selectedTool} />;
      case 'image-generator':
        return <ImageGeneratorTool tool={selectedTool} />;
      case 'content-rewriter':
        return <ContentRewriterTool tool={selectedTool} />;
      case 'chatbot':
        return <ChatbotTool tool={selectedTool} />;
      case 'transcribe-audio':
        return <AudioTranscriptionTool tool={selectedTool} />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} onShowTerms={() => setShowTerms(true)} />
        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </>
    );
  }

  return (
    <>
      <div className="h-screen flex font-sans bg-light">
        <Sidebar 
          tools={TOOLS}
          selectedTool={selectedTool}
          onSelectTool={handleSelectTool}
          onGoHome={handleGoHome}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-grow overflow-y-auto p-4 md:p-8">
            {selectedTool ? (
              <div className="animate-fade-in">
                {renderToolComponent()}
              </div>
            ) : (
              <ToolDashboard onSelectTool={handleSelectTool} />
            )}
          </main>
          <Footer onShowTerms={() => setShowTerms(true)} />
        </div>
      </div>
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </>
  );
};

export default App;
