'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  generationId: string;
  onError?: () => void;
}

interface ProgressData {
  status: string;
  progress: number;
  message: string;
  videoUrl?: string;
  scriptUrl?: string;
  metadataPath?: string;
  videoPath?: string;
}

interface TaskProgress {
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  message?: string;
}

export default function ProgressBar({ generationId, onError }: ProgressBarProps) {
  const [progress, setProgress] = useState<ProgressData>({
    status: 'started',
    progress: 0,
    message: 'Starting video generation...',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const tasks: TaskProgress[] = [
    { name: 'Script Generation', status: 'pending' },
    { name: 'Search Terms', status: 'pending' },
    { name: 'Video Download', status: 'pending' },
    { name: 'Audio Generation', status: 'pending' },
    { name: 'Subtitles Creation', status: 'pending' },
    { name: 'Final Compilation', status: 'pending' }
  ];

  const [currentTask, setCurrentTask] = useState<number>(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkProgress = async () => {
      try {
        const response = await fetch(`${API_URL}/api/progress/${generationId}`);
        const data = await response.json();
        
        if (data.status === 'not_found') {
          // If generation not found, show starting status
          setProgress({
            status: 'processing',
            progress: 0,
            message: 'Starting video generation...'
          });
        } else {
          setProgress(data);
        }

        if (data.status !== 'completed' && data.status !== 'error') {
          timeoutId = setTimeout(checkProgress, 1000);
        } else if (data.status === 'error') {
          onError?.();
        }
      } catch (error) {
        console.error('Error checking progress:', error);
        setProgress(prev => ({
          ...prev,
          message: 'Checking generation progress...'
        }));
        timeoutId = setTimeout(checkProgress, 1000);
      }
    };

    checkProgress();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [generationId, API_URL, onError]);

  useEffect(() => {
    // Update current task based on progress message
    if (progress.message?.toLowerCase().includes('script')) {
      setCurrentTask(0);
    } else if (progress.message?.toLowerCase().includes('search')) {
      setCurrentTask(1);
    } else if (progress.message?.toLowerCase().includes('download')) {
      setCurrentTask(2);
    } else if (progress.message?.toLowerCase().includes('audio')) {
      setCurrentTask(3);
    } else if (progress.message?.toLowerCase().includes('subtitles')) {
      setCurrentTask(4);
    } else if (progress.message?.toLowerCase().includes('final')) {
      setCurrentTask(5);
    }
  }, [progress.message]);

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
    <div className="bg-white dark:bg-foreground/5 rounded-xl shadow-lg p-8 space-y-8">
      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="relative">
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <span className="absolute right-0 top-6 text-sm font-medium text-gray-500">
            {progress.progress}%
          </span>
        </div>
        
        {/* Time Note */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Note: The AI Video Generator Agent takes 5 minutes on average.
          </p>
        </div>
      </div>

      {/* Task Progress List */}
      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <div 
            key={task.name} 
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors
              ${index === currentTask ? 'bg-blue-50 dark:bg-blue-900/10' : 
                index < currentTask ? 'bg-green-50 dark:bg-green-900/10' : 
                'bg-gray-50 dark:bg-gray-800/30'}`}
          >
            {/* Task Status Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
              ${index === currentTask ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                index < currentTask ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 
                'bg-gray-200 text-gray-400 dark:bg-gray-700'}`}
            >
              {index < currentTask ? (
                <CheckIcon className="w-5 h-5" />
              ) : index === currentTask ? (
                <SpinnerIcon className="w-5 h-5 animate-spin" />
              ) : (
                <CircleIcon className="w-5 h-5" />
              )}
            </div>

            {/* Task Name and Status */}
            <div className="flex-1">
              <span className={`font-medium block
                ${index === currentTask ? 'text-blue-700 dark:text-blue-300' : 
                  index < currentTask ? 'text-green-700 dark:text-green-300' : 
                  'text-gray-500 dark:text-gray-400'}`}
              >
                {task.name}
              </span>
              {index === currentTask && (
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {progress.message}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* File Paths */}
      {(progress.metadataPath || progress.videoPath) && (
        <div className="border border-gray-100 dark:border-gray-800 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
          {progress.metadataPath && (
            <div className="p-4 text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Metadata saved at: </span>
              <code className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded">
                {progress.metadataPath}
              </code>
            </div>
          )}
          {progress.videoPath && (
            <div className="p-4 text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Final video created: </span>
              <code className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded">
                {progress.videoPath}
              </code>
            </div>
          )}
        </div>
      )}

      {/* Success Message with Download Buttons */}
      {progress.status === 'completed' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-100 dark:border-green-900/20 rounded-lg p-6 text-center space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
              🎉 Video Generated Successfully!
            </h3>
            <p className="text-green-600 dark:text-green-400 mt-2">
              Your files are ready to download
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleDownload('video')}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Download Video
            </button>
            <button
              onClick={() => handleDownload('script')}
              className="px-6 py-2.5 bg-white text-green-700 rounded-full hover:bg-green-50 transition-all duration-200 font-medium border border-green-200 shadow-sm hover:shadow-md"
            >
              Download Script
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {progress.status === 'error' && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">
            Error Generating Video
          </h3>
          <p className="text-red-600 dark:text-red-400 mt-2">{progress.message}</p>
        </div>
      )}
    </div>
  );
}

// Icons
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
  </svg>
); 