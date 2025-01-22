import VideoForm from './components/VideoForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MoneyPrinter</h1>
          <p className="text-gray-600">
            This Application is intended to automate the creation and uploads of YouTube Shorts.
          </p>
        </div>

        <VideoForm />

        <footer className="mt-12 text-center text-gray-600">
          <p>
            Made with ❤️ by{' '}
            <a
              href="https://github.com/FujiwaraChoki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Fuji Codes
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
} 