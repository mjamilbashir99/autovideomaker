'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  generationId: string;
}

interface ProgressData {
  status: string;
  progress: number;
  message: string;
  videoUrl?: string;
  scriptUrl?: string;
}

export default function ProgressBar({ generationId }: ProgressBarProps) {
  const [progress, setProgress] = useState<ProgressData>({
    status: 'started',
    progress: 0,
    message: 'Starting...',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const response = await fetch(`${API_URL}/api/progress/${generationId}`);
        const data = await response.json();
        
        setProgress(data);

        if (data.status !== 'completed' && data.status !== 'error') {
          setTimeout(checkProgress, 1000);
        }
      } catch (error) {
        console.error('Error checking progress:', error);
      }
    };

    checkProgress();
  }, [generationId, API_URL]);

  const handleDownload = async (type: 'video' | 'script') => {
    try {
      const url = type === 'video' ? progress.videoUrl : progress.scriptUrl;
      if (!url) return;

      const response = await fetch(`${API_URL}${url}`);
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = type === 'video' ? 'video.mp4' : 'script.txt';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
      alert(`Failed to download ${type}. Please try again.`);
    }
  };

  return (
    <div className="bg-white dark:bg-foreground/5 rounded-lg shadow-sm p-6 space-y-4">
      {/* Progress Bar */}
      <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-500"
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      {/* Status and Message */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground/90 capitalize">
          {progress.status}
        </p>
        <p className="text-foreground/70">{progress.message}</p>
        <p className="text-foreground/90 font-medium">{progress.progress}%</p>
      </div>

      {/* Success Message with Download Buttons */}
      {progress.status === 'completed' && (
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-lg p-4 space-y-4">
          <div className="text-center">
            <h3 className="text-green-800 dark:text-green-200 font-medium">
              🎉 Video Generated Successfully!
            </h3>
            <p className="text-green-700 dark:text-green-300 mt-1">
              Your files are ready to download
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleDownload('video')}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            >
              Download Video
            </button>
            <button
              onClick={() => handleDownload('script')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              Download Script
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {progress.status === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-4 text-center">
          <h3 className="text-red-800 dark:text-red-200 font-medium">
            Error Generating Video
          </h3>
          <p className="text-red-700 dark:text-red-300">{progress.message}</p>
        </div>
      )}
    </div>
  );
} 