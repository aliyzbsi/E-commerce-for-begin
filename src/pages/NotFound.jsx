import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        Sayfa Bulunamadı
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfaya
        dönmeyi deneyin.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

export default NotFound;
