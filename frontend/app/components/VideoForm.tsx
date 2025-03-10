"use client";

import { useState } from "react";
import AdvancedOptions from "./AdvancedOptions";
import ProgressBar from "./ProgressBar";

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        videoSubject: formData.get("videoSubject") as string,
        aiModel: formData.get("aiModel") || "g4f",
        voice: formData.get("voice") || "en_us_001",
        paragraphNumber: Number(formData.get("paragraphNumber")) || 1,
        automateYoutubeUpload: formData.get("youtubeUploadToggle") === "on",
        useMusic: formData.get("useMusicToggle") === "on",
        zipUrl: formData.get("zipUrl") as string,
        threads: Number(formData.get("threads")) || 2,
        subtitlesPosition: formData.get("subtitlesPosition") || "center,center",
        customPrompt: formData.get("customPrompt") as string,
        color: formData.get("subtitlesColor") || "#FFFF00",
      };

      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === "error") {
        throw new Error(result.message);
      }

      if (result.generation_id) {
        setGenerationId(result.generation_id);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsGenerating(false);
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const GenerateButton = ({ className = "" }) => (
    <button
      type="submit"
      disabled={isGenerating}
      className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium ${className}`}
    >
      {isGenerating ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generating...
        </span>
      ) : (
        "Generate Video"
      )}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Progress Bar */}
      {isGenerating && generationId && (
        <ProgressBar
          generationId={generationId}
          onError={() => setIsGenerating(false)}
        />
      )}

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

      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-foreground/80 hover:text-foreground font-medium flex items-center gap-2"
        >
          <span>
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </span>
          <span>{showAdvanced ? "▲" : "▼"}</span>
        </button>

        <GenerateButton />
      </div>

      {/* Advanced Options */}
      {showAdvanced && <AdvancedOptions />}

      {/* Bottom Generate Button */}
      {showAdvanced && (
        <div className="flex justify-center pt-4">
          <GenerateButton className="w-full sm:w-auto" />
        </div>
      )}
    </form>
  );
}
