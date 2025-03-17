import { useState } from "react";
import { FaSort, FaFilter, FaTimes } from "react-icons/fa";

function SortAndFilter({ onSort, onFilter, activeFilters, clearFilters }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions = [
    { value: "default", label: "Varsayılan Sıralama" },
    { value: "price-asc", label: "Fiyat (Düşükten Yükseğe)" },
    { value: "price-desc", label: "Fiyat (Yüksekten Düşüğe)" },
    { value: "rating-desc", label: "Puan (Yüksekten Düşüğe)" },
    { value: "name-asc", label: "İsim (A-Z)" },
    { value: "name-desc", label: "İsim (Z-A)" },
    { value: "discount-desc", label: "İndirim Oranı (Yüksekten Düşüğe)" },
  ];

  const handleSortChange = (e) => {
    onSort(e.target.value);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <label
              htmlFor="sort"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FaSort />
              Sırala:
            </label>
            <select
              id="sort"
              onChange={handleSortChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
          >
            <FaFilter />
            <span>Filtreler</span>
            {Object.keys(activeFilters).length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </button>
        </div>

        {Object.keys(activeFilters).length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FaTimes />
            <span>Filtreleri Temizle</span>
          </button>
        )}
      </div>

      {isFilterOpen && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-3">Gelişmiş Filtreler</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Fiyat Aralığı
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => onFilter("minPrice", e.target.value)}
                  value={activeFilters.minPrice || ""}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => onFilter("maxPrice", e.target.value)}
                  value={activeFilters.maxPrice || ""}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Minimum Puan
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onFilter("minRating", e.target.value)}
                value={activeFilters.minRating || ""}
              >
                <option value="">Tümü</option>
                <option value="4">4 ve üzeri</option>
                <option value="3">3 ve üzeri</option>
                <option value="2">2 ve üzeri</option>
                <option value="1">1 ve üzeri</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stok Durumu
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onFilter("inStock", e.target.value)}
                value={activeFilters.inStock || ""}
              >
                <option value="">Tümü</option>
                <option value="true">Stokta Var</option>
                <option value="false">Tükendi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Minimum İndirim Oranı
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onFilter("minDiscount", e.target.value)}
                value={activeFilters.minDiscount || ""}
              >
                <option value="">Tümü</option>
                <option value="50">%50 ve üzeri</option>
                <option value="30">%30 ve üzeri</option>
                <option value="20">%20 ve üzeri</option>
                <option value="10">%10 ve üzeri</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Marka</label>
              <input
                type="text"
                placeholder="Marka ara"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onFilter("brand", e.target.value)}
                value={activeFilters.brand || ""}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SortAndFilter;
