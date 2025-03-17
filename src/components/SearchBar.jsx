import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../services/api";
import { FaSearch, FaTimes, FaHistory } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Arama geçmişini localStorage'dan yükle
  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Dışarı tıklandığında arama sonuçlarını kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Arama sonuçlarını getir
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => searchProducts(searchTerm),
    enabled: searchTerm.length > 2,
  });

  // Arama işlemi
  const handleSearch = (term) => {
    if (!term || term.trim().length < 3) return;

    // Arama geçmişine ekle
    const newHistory = [
      term,
      ...searchHistory.filter((item) => item !== term),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    // Arama sayfasına yönlendir
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.length > 2) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            if (searchTerm.length > 2 || searchHistory.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchTerm);
            }
          }}
          placeholder="Ürün, kategori veya marka ara..."
          className="w-full h-10 pl-10 pr-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
          >
            <FaTimes className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-2 rounded-lg shadow-lg overflow-hidden border ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          {searchTerm.length > 2 ? (
            <>
              {isLoading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Aranıyor...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Arama Sonuçları
                  </div>
                  {searchResults.slice(0, 5).map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => navigate(`/product/${result.id}`)}
                    >
                      <img
                        src={result.thumbnail || "/placeholder.svg"}
                        alt={result.title}
                        className="w-10 h-10 object-cover rounded-md bg-white p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {result.category}
                        </p>
                      </div>
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        {result.price.toFixed(2)} ₺
                      </p>
                    </div>
                  ))}
                  {searchResults.length > 5 && (
                    <div
                      className="p-3 text-center text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer font-medium"
                      onClick={() => handleSearch(searchTerm)}
                    >
                      Tüm sonuçları gör ({searchResults.length})
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  "{searchTerm}" için sonuç bulunamadı
                </div>
              )}
            </>
          ) : (
            <>
              {searchHistory.length > 0 && (
                <div>
                  <div className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase flex justify-between items-center">
                    <span>Son Aramalar</span>
                    <button
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => {
                        setSearchHistory([]);
                        localStorage.removeItem("searchHistory");
                      }}
                    >
                      Temizle
                    </button>
                  </div>
                  {searchHistory.map((term, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(term);
                        handleSearch(term);
                      }}
                    >
                      <FaHistory className="text-gray-400" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
