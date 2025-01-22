'use client';

import { useState } from 'react';
import ProgressBar from './ProgressBar';
import AdvancedOptions from './AdvancedOptions';

export default function VideoForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      videoSubject: formData.get('videoSubject'),
      aiModel: formData.get('aiModel'),
      voice: formData.get('voice'),
      paragraphNumber: Number(formData.get('paragraphNumber')),
      automateYoutubeUpload: formData.get('youtubeUploadToggle') === 'on',
      useMusic: formData.get('useMusicToggle') === 'on',
      zipUrl: formData.get('zipUrl'),
      threads: Number(formData.get('threads')),
      subtitlesPosition: formData.get('subtitlesPosition'),
      customPrompt: formData.get('customPrompt'),
      color: formData.get('subtitlesColor'),
    };

    try {
      const response = await fetch('http://localhost:8080/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.generation_id) {
        setGenerationId(result.generation_id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await fetch('http://localhost:8080/api/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsGenerating(false);
      setGenerationId(null);
    } catch (error) {
      console.error('Error cancelling:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Video Subject</span>
          <textarea
            name="videoSubject"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={3}
            required
          />
        </label>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          {showAdvanced ? 'Hide Advanced Options ▲' : 'Show Advanced Options ▼'}
        </button>

        {showAdvanced && <AdvancedOptions />}

        <div className="flex gap-4">
          {!isGenerating ? (
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Generate
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {generationId && <ProgressBar generationId={generationId} />}
    </form>
  );
} 