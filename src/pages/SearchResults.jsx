import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../services/api";
import Products from "../components/Products";
import { FaSearch, FaSpinner } from "react-icons/fa";
import SortAndFilter from "../components/SortAndFilter";

function SearchResults({ sepet, setSepet, loggedUser }) {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [activeFilters, setActiveFilters] = useState({});

  // URL'den arama terimini al
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);

  // Arama sonuçlarını getir
  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => searchProducts(searchTerm),
    enabled: searchTerm.length > 2,
  });

  // Sıralama işlevi
  const handleSort = (sortValue) => {
    setSortOption(sortValue);
  };

  // Filtreleme işlevi
  const handleFilter = (filterKey, filterValue) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: filterValue,
    }));
  };

  // Filtreleri temizleme işlevi
  const clearFilters = () => {
    setActiveFilters({});
  };

  // Ürünleri filtrele ve sırala
  const processedProducts = (() => {
    if (!searchResults || searchResults.length === 0) {
      return [];
    }

    let filteredProducts = [...searchResults];

    // Aktif filtreleri uygula
    if (activeFilters.minPrice) {
      filteredProducts = filteredProducts.filter(
        (item) => item.price >= Number(activeFilters.minPrice)
      );
    }

    if (activeFilters.maxPrice) {
      filteredProducts = filteredProducts.filter(
        (item) => item.price <= Number(activeFilters.maxPrice)
      );
    }

    if (activeFilters.minRating) {
      filteredProducts = filteredProducts.filter((item) => {
        const rating = typeof item.rating === "number" ? item.rating : 0;
        return rating >= Number(activeFilters.minRating);
      });
    }

    if (activeFilters.inStock === "true") {
      filteredProducts = filteredProducts.filter((item) => item.stock > 0);
    } else if (activeFilters.inStock === "false") {
      filteredProducts = filteredProducts.filter((item) => item.stock === 0);
    }

    if (activeFilters.minDiscount) {
      filteredProducts = filteredProducts.filter((item) => {
        const discount = item.discountPercentage || 0;
        return discount >= Number(activeFilters.minDiscount);
      });
    }

    if (activeFilters.brand && activeFilters.brand.trim() !== "") {
      const brandSearch = activeFilters.brand.toLowerCase().trim();
      filteredProducts = filteredProducts.filter((item) => {
        const brand = (item.brand || "").toLowerCase();
        return brand.includes(brandSearch);
      });
    }

    // Sıralama uygula
    const sortedProducts = [...filteredProducts];

    switch (sortOption) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sortedProducts.sort((a, b) => {
          const ratingA = typeof a.rating === "number" ? a.rating : 0;
          const ratingB = typeof b.rating === "number" ? b.rating : 0;
          return ratingB - ratingA;
        });
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "discount-desc":
        sortedProducts.sort(
          (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
        );
        break;
      default:
        // Varsayılan sıralama
        break;
    }

    return sortedProducts;
  })();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Arama sonuçları yüklenirken bir hata oluştu.</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FaSearch className="text-gray-400" />
        <h1 className="text-2xl font-bold">
          "{searchTerm}" için arama sonuçları
        </h1>
      </div>

      <div className="text-gray-500 dark:text-gray-400">
        {processedProducts.length} sonuç bulundu
      </div>

      <SortAndFilter
        onSort={handleSort}
        onFilter={handleFilter}
        activeFilters={activeFilters}
        clearFilters={clearFilters}
      />

      {processedProducts.length > 0 ? (
        <Products
          products={processedProducts}
          sepet={sepet}
          setSepet={setSepet}
          loggedUser={loggedUser}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-2">Sonuç bulunamadı</p>
          <p className="text-gray-500 dark:text-gray-400">
            Lütfen farklı anahtar kelimeler ile tekrar arayın veya filtreleri
            değiştirin
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
