import { useQuery } from "@tanstack/react-query";
import Products from "../components/Products";
import { getFilteredProduct, getProduct } from "../services/api";
import { useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaSpinner } from "react-icons/fa";
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

  // Kategori filtreleme işlevi
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

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

  // Ürünleri filtrele ve sırala - useMemo ile optimize et
  const displayedProducts = useMemo(() => {
    // Temel ürün listesini belirle
    let baseProducts = [];

    if (Array.isArray(sideBarFilter) && sideBarFilter.length > 0) {
      baseProducts = [...sideBarFilter];
    } else if (Array.isArray(allProducts)) {
      // Tüm ürünleri kullan ve kategori filtresi uygula
      baseProducts = allProducts.filter((item) => {
        if (selectedCategory === "Tüm Ürünler") return true;

        const itemCategory =
          typeof item.category === "object" && item.category !== null
            ? item.category.name ||
              item.category.slug ||
              JSON.stringify(item.category)
            : item.category;

        return (
          itemCategory === selectedCategory ||
          itemCategory.toLowerCase() === selectedCategory.toLowerCase()
        );
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
            const categoryName =
              typeof category === "object" && category !== null
                ? category.name || category.slug || JSON.stringify(category)
                : category;

            return (
              <button
                key={index}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                  ${
                    selectedCategory === categoryName
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
                onClick={() => handleCategoryChange(categoryName)}
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

      <Products
        products={displayedProducts}
        sepet={sepet}
        setSepet={setSepet}
        loggedUser={loggedUser}
      />
    </div>
  );
}

export default Home;
