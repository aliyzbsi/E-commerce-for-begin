import { useQuery } from "@tanstack/react-query";
import Products from "../components/Products";
import { getFilteredProduct, getProduct } from "../services/api";
import { useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaSpinner, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SortAndFilter from "../components/SortAndFilter";
import HomeSlider from "../components/HomeSlider";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import CompareProducts from "../components/CompareProducts";

function Home({ sepet, sideBarFilter, setSepet, loggedUser }) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("Tüm Ürünler");
  const [sortOption, setSortOption] = useState("default");
  const [activeFilters, setActiveFilters] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Kategorileri getir
  const {
    data: categories = [],
    error: categoryError,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getFilteredProduct,
  });

  // Tüm ürünleri getir
  const {
    data: allProducts = [],
    error: productError,
    isLoading: isLoadingProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProduct,
  });

  // Kategori adını veya slug'ını almak için yardımcı fonksiyon
  const getCategoryName = (category) => {
    if (typeof category === "string") return category;
    if (typeof category === "object" && category !== null) {
      return category.name || category.slug || JSON.stringify(category);
    }
    return "";
  };

  // Kategori filtreleme işlevi
  const handleCategoryChange = (category) => {
    // Kategori bir obje ise, slug veya name'i kullan, değilse direkt kategoriyi kullan
    const categoryValue =
      typeof category === "object" && category !== null
        ? category.slug || category.name || JSON.stringify(category)
        : category;

    setSelectedCategory(categoryValue);
    setCurrentPage(1); // Reset to first page when changing category
  };

  // Sıralama işlevi
  const handleSort = (sortValue) => {
    setSortOption(sortValue);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Filtreleme işlevi
  const handleFilter = (filterKey, filterValue) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: filterValue,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Filtreleri temizleme işlevi
  const clearFilters = () => {
    setActiveFilters({});
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Ürünleri filtrele ve sırala - useMemo ile optimize et
  const filteredAndSortedProducts = useMemo(() => {
    // Temel ürün listesini belirle
    let baseProducts = [];

    if (Array.isArray(sideBarFilter) && sideBarFilter.length > 0) {
      baseProducts = [...sideBarFilter];
    } else if (Array.isArray(allProducts)) {
      // Tüm ürünleri kullan ve kategori filtresi uygula
      baseProducts = allProducts.filter((item) => {
        if (selectedCategory === "Tüm Ürünler") return true;

        // Ürünün kategorisini string olarak al
        const itemCategory = getCategoryName(item.category).toLowerCase();

        // selectedCategory her zaman string olmalı
        return itemCategory === selectedCategory.toLowerCase();
      });
    } else {
      return [];
    }

    if (!baseProducts || baseProducts.length === 0) {
      return [];
    }

    // Aktif filtreleri uygula
    let filteredProducts = [...baseProducts];

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
        break;
    }

    return sortedProducts;
  }, [allProducts, sideBarFilter, selectedCategory, sortOption, activeFilters]);

  // Pagination calculations
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Get current page products
  const displayedProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredAndSortedProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
  }, [filteredAndSortedProducts, currentPage, productsPerPage]);

  // Change page
  const paginate = (pageNumber) => {
    // Ensure page number is within valid range
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;

    setCurrentPage(pageNumber);
    // Scroll to top when changing page
    window.scrollTo({
      top: document.getElementById("products-section")?.offsetTop - 100 || 0,
      behavior: "smooth",
    });
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    // Calculate page range to display
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
          }`}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className={`px-3 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/20`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 dark:hover:bg-blue-900/20"
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => paginate(totalPages)}
              className={`px-3 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/20`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
          }`}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  if (isLoadingCategories || isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  if (categoryError || productError) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Veri yüklenirken bir hata oluştu.</p>
        <p className="text-sm mt-2">
          {categoryError?.message || productError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HomeSlider />
      <FeaturedCategories />
      <FeaturedProducts
        sepet={sepet}
        setSepet={setSepet}
        loggedUser={loggedUser}
      />
      <CompareProducts />
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          <button
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
              ${
                selectedCategory === "Tüm Ürünler"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }
            `}
            onClick={() => handleCategoryChange("Tüm Ürünler")}
          >
            Tüm Ürünler
          </button>

          {categories.map((category, index) => {
            const categoryName = getCategoryName(category);
            const categoryValue =
              typeof category === "object" && category !== null
                ? category.slug || category.name || JSON.stringify(category)
                : category;

            return (
              <button
                key={index}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    selectedCategory === categoryValue
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
                onClick={() => {
                  console.log(category);
                  handleCategoryChange(category);
                }}
              >
                {categoryName}
              </button>
            );
          })}
        </div>
      </div>

      <SortAndFilter
        onSort={handleSort}
        onFilter={handleFilter}
        activeFilters={activeFilters}
        clearFilters={clearFilters}
      />

      <div id="products-section">
        {/* Product count and pagination info */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Toplam {totalProducts} ürün bulundu
            {totalPages > 1 && ` • Sayfa ${currentPage}/${totalPages}`}
          </p>

          {/* Mobile pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                }`}
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>
              <span className="text-sm">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                }`}
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>

        <Products
          products={displayedProducts}
          sepet={sepet}
          setSepet={setSepet}
          loggedUser={loggedUser}
        />

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
}

export default Home;
