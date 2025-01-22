'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  generationId: string;
}

interface ProgressData {
  status: string;
  progress: number;
  message: string;
}

export default function ProgressBar({ generationId }: ProgressBarProps) {
  const [progress, setProgress] = useState<ProgressData>({
    status: 'started',
    progress: 0,
    message: 'Starting...',
  });

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/progress/${generationId}`);
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
  }, [generationId]);

  return (
    <div className="mt-6 space-y-4">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${progress.progress}%` }}
        />
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold capitalize">{progress.status}</p>
        <p className="text-gray-600">{progress.message}</p>
        <p className="text-indigo-600 font-bold">{progress.progress}%</p>
      </div>

      {progress.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <h3 className="text-green-800 font-semibold">🎉 Video Generated Successfully!</h3>
          <p className="text-green-600">Your video is ready to download</p>
        </div>
      )}

      {progress.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <h3 className="text-red-800 font-semibold">Error Generating Video</h3>
          <p className="text-red-600">{progress.message}</p>
        </div>
      )}
    </div>
  );
} 