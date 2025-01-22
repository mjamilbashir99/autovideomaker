'use client';

import { useState } from 'react';
import AdvancedOptions from './AdvancedOptions';
import ProgressBar from './ProgressBar';

interface FormData {
  videoSubject: string;
  aiModel: string;
  voice: string;
  paragraphNumber: number;
  automateYoutubeUpload: boolean;
  useMusic: boolean;
  zipUrl: string;
  threads: number;
  subtitlesPosition: string;
  customPrompt: string;
  color: string;
}

export default function VideoForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        videoSubject: formData.get('videoSubject') as string,
        aiModel: formData.get('aiModel') || 'g4f',
        voice: formData.get('voice') || 'en_us_001',
        paragraphNumber: Number(formData.get('paragraphNumber')) || 1,
        automateYoutubeUpload: formData.get('youtubeUploadToggle') === 'on',
        useMusic: formData.get('useMusicToggle') === 'on',
        zipUrl: formData.get('zipUrl') as string,
        threads: Number(formData.get('threads')) || 2,
        subtitlesPosition: formData.get('subtitlesPosition') || 'center,bottom',
        customPrompt: formData.get('customPrompt') as string,
        color: formData.get('subtitlesColor') || '#FFFFFF',
      };

      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.status === 'error') {
        throw new Error(result.message);
      }

      if (result.generation_id) {
        setGenerationId(result.generation_id);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsGenerating(false);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Main Input */}
      <div className="bg-white dark:bg-foreground/5 rounded-lg shadow-sm p-6">
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            Video Subject
          </span>
          <textarea
            name="videoSubject"
            rows={3}
            className="w-full rounded-md border border-foreground/10 bg-background px-4 py-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
            placeholder="Enter your video subject here..."
            required
          />
        </label>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-foreground/80 hover:text-foreground font-medium flex items-center gap-2"
        >
          <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
          <span>{showAdvanced ? '▲' : '▼'}</span>
        </button>

        <button
          type="submit"
          disabled={isGenerating}
          className="bg-foreground text-background px-6 py-2 rounded-full hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && <AdvancedOptions />}

      {/* Progress Bar */}
      {generationId && <ProgressBar generationId={generationId} />}
    </form>
  );
} 