"use client";

export default function AdvancedOptions() {
  return (
    <div className="bg-gray-500 dark:bg-foreground/5 rounded-lg shadow-sm p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Model */}
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            AI Model
          </span>
          <select
            name="aiModel"
            defaultValue="g4f"
            className="w-full rounded-md border border-foreground/10 bg-background px-4 py-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
          >
            <option value="g4f">g4f (Free)</option>
            <option value="gpt3.5-turbo">OpenAI GPT-3.5</option>
            <option value="gpt4">OpenAI GPT-4</option>
            <option value="gemmini">Gemini Pro</option>
          </select>
        </label>

        {/* Voice Selection */}
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            Voice
          </span>
          <select
            name="voice"
            defaultValue="en_us_001"
            className="w-full rounded-md border border-foreground/10 bg-background px-4 py-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
          >
            <option value="en_us_001">English (US) - Female</option>
            <option value="en_us_002">English (US) - Male</option>
            <option value="en_us_006">English (US) - Male 2</option>
            <option value="en_us_007">English (US) - Male 3</option>
            <option value="en_us_009">English (US) - Female 2</option>
            <option value="en_us_010">English (US) - Male 4</option>
            <option value="en_male_narration">Male Narration</option>
            <option value="en_female_emotional">Female Emotional</option>
            <option value="en_male_funny">Male Funny</option>
            <option value="en_female_funny">Female Funny</option>
            <option value="en_us_ghostface">Ghost Face</option>
            <option value="en_us_chewbacca">Chewbacca</option>
            <option value="en_us_c3po">C3PO</option>
            <option value="en_us_stitch">Stitch</option>
            <option value="en_us_rocket">Rocket</option>
          </select>
        </label>

        {/* Paragraphs */}
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            Paragraphs
          </span>
          <input
            type="number"
            name="paragraphNumber"
            defaultValue={1}
            min={1}
            max={5}
            className="w-full rounded-md border border-foreground/10 bg-background px-4 py-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
          />
        </label>

        {/* Subtitles Position */}
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            Subtitles Position
          </span>
          <select
            name="subtitlesPosition"
            defaultValue="center,center"
            className="w-full rounded-md border border-foreground/10 bg-background px-4 py-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
          >
            <option value="center,top">Center - Top</option>
            <option value="center,center">Center - Center</option>
            <option value="center,bottom">Center - Bottom</option>
            <option value="left,center">Left - Center</option>
            <option value="left,bottom">Left - Bottom</option>
            <option value="right,center">Right - Center</option>
            <option value="right,bottom">Right - Bottom</option>
          </select>
        </label>

        {/* Subtitles Color */}
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            Subtitles Color
          </span>
          <input
            type="color"
            name="subtitlesColor"
            defaultValue="#FFFF00"
            className="w-full h-10 rounded-md border border-foreground/10 bg-background px-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
            onInput={(e) => e.currentTarget.blur()}
          />
        </label>

        {/* Processing Threads */}
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            Processing Threads
          </span>
          <input
            type="number"
            name="threads"
            defaultValue={2}
            min={1}
            max={8}
            className="w-full rounded-md border border-foreground/10 bg-background px-4 py-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
          />
        </label>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        {/* Custom Prompt */}
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            Custom Prompt (Optional)
          </span>
          <textarea
            name="customPrompt"
            rows={3}
            className="w-full rounded-md border border-foreground/10 bg-background px-4 py-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
            placeholder="Enter your custom prompt here..."
          />
        </label>

        {/* Music URL */}
        <label className="block">
          <span className="block text-foreground/90 font-medium mb-2">
            Music ZIP URL (Optional)
          </span>
          <input
            type="url"
            name="zipUrl"
            className="w-full rounded-md border border-foreground/10 bg-background px-4 py-2 text-foreground shadow-sm focus:border-foreground/20 focus:ring-2 focus:ring-foreground/10"
            placeholder="https://example.com/music.zip"
          />
        </label>

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="youtubeUploadToggle"
              className="rounded border-foreground/20 bg-background text-foreground"
            />
            <span className="text-foreground/90">Upload to YouTube</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="useMusicToggle"
              className="rounded border-foreground/20 bg-background text-foreground"
            />
            <span className="text-foreground/90">Add Background Music</span>
          </label>
        </div>
      </div>
    </div>
  );
}
