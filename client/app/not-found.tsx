import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>

        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>

        <p className="text-gray-600 mt-2 max-w-md">
          The page you are looking for does not exist or may have been moved.
        </p>

        <a
          href="/"
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Home
        </a>
      </div>
    </>
  );
}
