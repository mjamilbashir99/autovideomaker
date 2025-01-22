export default function AdvancedOptions() {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-gray-700">AI Model</span>
        <select
          name="aiModel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="g4f">g4f (Free)</option>
          <option value="gpt3.5-turbo">OpenAI GPT-3.5</option>
          <option value="gpt4">OpenAI GPT-4</option>
          <option value="gemmini">Gemini Pro</option>
        </select>
      </label>

      {/* Add all other advanced options here */}
      {/* Voice selection */}
      <label className="block">
        <span className="text-gray-700">Voice</span>
        <select
          name="voice"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {/* Add all voice options here */}
        </select>
      </label>

      {/* Add other fields like subtitles position, color, etc. */}
      
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="youtubeUploadToggle"
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="text-gray-700">Upload to YouTube</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="useMusicToggle"
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="text-gray-700">Use Music</span>
        </label>
      </div>
    </div>
  );
} 