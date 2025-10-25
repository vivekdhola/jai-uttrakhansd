
import { Tool } from './types';
import { SongIcon, ImageIcon, RewriteIcon, ChatIcon, MicrophoneIcon, VocalIcon, MusicNoteIcon, VideoIcon, MergeIcon } from './components/IconComponents';

export const TOOLS: Tool[] = [
  {
    id: 'pdf-merge',
    title: 'PDF Merge',
    description: 'Combine multiple PDF files into a single document.',
    icon: MergeIcon,
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
  },
  {
    id: 'video-generator',
    title: 'AI Video Generator',
    description: 'Create a short video from an image and a text prompt.',
    icon: VideoIcon,
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
  },
  {
    id: 'song-writer',
    title: 'AI Song Writer',
    description: 'Generate creative song lyrics from a simple prompt.',
    icon: SongIcon,
    color: 'bg-accent',
    hoverColor: 'hover:bg-amber-500',
  },
  {
    id: 'vocal-track-maker',
    title: 'AI Multi-Voice Song',
    description: 'Generate a vocal track with multiple AI voices.',
    icon: VocalIcon,
    color: 'bg-rose-500',
    hoverColor: 'hover:bg-rose-600',
  },
  {
    id: 'music-composer',
    title: 'AI Music Composer',
    description: 'Create musical ideas with specified instruments.',
    icon: MusicNoteIcon,
    color: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600',
  },
  {
    id: 'image-generator',
    title: 'AI Image Generator',
    description: 'Create stunning, unique images from text descriptions.',
    icon: ImageIcon,
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
  },
  {
    id: 'content-rewriter',
    title: 'AI Content Rewriter',
    description: 'Paraphrase and enhance your text for clarity and impact.',
    icon: RewriteIcon,
    color: 'bg-secondary',
    hoverColor: 'hover:bg-emerald-600',
  },
  {
    id: 'chatbot',
    title: 'Chat with AI',
    description: 'Have a conversation, brainstorm ideas, or get answers.',
    icon: ChatIcon,
    color: 'bg-sky-500',
    hoverColor: 'hover:bg-sky-600',
  },
  {
    id: 'transcribe-audio',
    title: 'Transcribe Audio',
    description: 'Record audio and convert it to text using AI.',
    icon: MicrophoneIcon,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
  },
];


export const PREBUILT_VOICES = [
    { id: 'Kore', name: 'Kore (Female)'},
    { id: 'Puck', name: 'Puck (Male)'},
    { id: 'Charon', name: 'Charon (Male)'},
    { id: 'Fenrir', name: 'Fenrir (Male)'},
    { id: 'Zephyr', name: 'Zephyr (Female)'}
];

export const INSTRUMENTS = [
    'Dhol', 'Flute', 'Guitar', 'Tabla', 'Violin', 'Piano', 'Drums', 'Saxophone', 'Trumpet', 'Sitar'
];
