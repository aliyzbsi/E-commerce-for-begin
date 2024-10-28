import { useQuery } from "@tanstack/react-query";
import Products from "../components/Products";
import { getFilteredProduct, getProduct } from "../services/apiService";
import { useState } from "react";

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

  if (isLoadingCategories || isLoadingProducts) return <p>Loading...</p>;
  if (categoryError || productError) return <p>Error loading data</p>;

  return (
    <div>
      <div className="flex items-center justify-around flex-wrap gap-2 p-4 ">
        <button
          className="border-2 border-black uppercase hover:bg-red-500 hover:text-white hover:border-red-500 px-4 py-2 rounded-2xl"
          onClick={() => filteredCategory("Tüm Ürünler")}
        >
          Tüm Ürünler
        </button>
        {categories.map((category, index) => (
          <button
            className="border-2 border-black uppercase hover:bg-red-500 hover:text-white hover:border-red-500 px-4 py-2 rounded-2xl"
            key={index}
            onClick={() => filteredCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div>
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
