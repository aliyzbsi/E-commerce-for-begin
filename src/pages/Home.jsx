import { useQuery } from "@tanstack/react-query";
import Products from "../components/Products";
import { getFilteredProduct, getProduct } from "../services/apiService";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Home({ sepet, sideBarFilter, setSepet, loggedUser }) {
  const {
    data: categories = [],
    error: categoryError,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getFilteredProduct,
  });

  const {
    data: products = [],
    error: productError,
    isLoading: isLoadingProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProduct,
  });

  const [selectedCategory, setSelectedCategory] = useState("Tüm Ürünler");

  const filteredCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products.filter((item) => {
    const matchesSidebarFilter =
      sideBarFilter.length > 0 ? sideBarFilter.includes(item) : true;

    const matchesSelectedCategory =
      selectedCategory === "Tüm Ürünler" || item.category === selectedCategory;

    return matchesSidebarFilter && matchesSelectedCategory;
  });
  const { theme } = useTheme();
  if (isLoadingCategories || isLoadingProducts) return <p>Loading...</p>;
  if (categoryError || productError) return <p>Error loading data</p>;

  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } w-full p-4`}
    >
      <div className="flex flex-wrap items-center justify-center gap-4 p-4  border-b-2 ">
        <button
          className="border-2  uppercase hover:bg-red-500 hover:text-white hover:border-red-500 px-6 py-2 rounded-2xl transition-all duration-200"
          onClick={() => filteredCategory("Tüm Ürünler")}
        >
          Tüm Ürünler
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            className="border-2  uppercase hover:bg-red-500 hover:text-white hover:border-red-500 px-6 py-2 rounded-2xl transition-all duration-200"
            onClick={() => filteredCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Products
          products={filteredProducts}
          sepet={sepet}
          setSepet={setSepet}
          loggedUser={loggedUser}
        />
      </div>
    </div>
  );
}

export default Home;
