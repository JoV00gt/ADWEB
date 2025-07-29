export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Pagina niet gevonden</h2>
        <p className="text-gray-600 mb-6">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Terug naar dashboard
        </a>
      </div>
    </div>
  );
}
