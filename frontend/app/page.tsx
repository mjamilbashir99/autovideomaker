import VideoForm from "@/app/components/VideoForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Video Generator
          </h1>
          <p className="text-foreground/80">
            Create stunning videos with artificial intelligence
          </p>
        </div>
        <VideoForm />
      </main>
    </div>
  );
}
