"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../services/api";
import { FaTimes, FaPlus, FaSearch, FaSpinner } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";

function CompareProducts() {
  const [compareProducts, setCompareProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  // LocalStorage'dan karşılaştırma listesini yükle
  useEffect(() => {
    const savedProducts = localStorage.getItem("compareProducts");
    if (savedProducts) {
      try {
        setCompareProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error("Karşılaştırma listesi yüklenirken hata oluştu:", error);
      }
    }
  }, []);

  // Karşılaştırma listesi değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
  }, [compareProducts]);

  // Ürünleri getir
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProduct,
  });

  // Ürün ekle
  const addProduct = (product) => {
    if (compareProducts.length >= 3) {
      toast.warning("En fazla 3 ürün karşılaştırabilirsiniz");
      return;
    }

    if (compareProducts.some((p) => p.id === product.id)) {
      toast.info("Bu ürün zaten karşılaştırma listenizde");
      return;
    }

    setCompareProducts([...compareProducts, product]);
    setShowAddModal(false);
    setSearchTerm("");
    toast.success("Ürün karşılaştırma listesine eklendi");
  };

  // Ürün çıkar
  const removeProduct = (productId) => {
    setCompareProducts(compareProducts.filter((p) => p.id !== productId));
    toast.success("Ürün karşılaştırma listesinden çıkarıldı");
  };

  // Tüm ürünleri temizle
  const clearAll = () => {
    setCompareProducts([]);
    toast.success("Karşılaştırma listesi temizlendi");
  };

  // Arama sonuçları - Güvenli bir şekilde undefined kontrolü yapılıyor
  const searchResults =
    searchTerm.length > 2
      ? products.filter(
          (product) =>
            (product.title &&
              product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.category &&
              product.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (product.brand &&
              product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : [];

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ürün Karşılaştırma</h2>

        {compareProducts.length > 0 && (
          <button
            onClick={clearAll}
            className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <FaTimes size={14} />
            <span>Tümünü Temizle</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {compareProducts.map((product) => (
          <div
            key={product.id}
            className={`rounded-xl shadow-md overflow-hidden ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <div className="relative">
              <button
                onClick={() => removeProduct(product.id)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <FaTimes />
              </button>

              <div
                className="h-48 p-4 flex items-center justify-center cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.thumbnail || "/placeholder.svg"}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <div className="p-4">
              <h3
                className="font-medium mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {product.category || "Kategori Yok"}
              </p>

              <p className="font-bold text-blue-600 dark:text-blue-400 mb-4">
                {product.price.toFixed(2)} ₺
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Marka:
                  </span>
                  <span>{product.brand || "Belirtilmemiş"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Puan:
                  </span>
                  <span>{product.rating || 0}/5</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Stok:
                  </span>
                  <span>{product.stock || 0} adet</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    İndirim:
                  </span>
                  <span>%{Math.round(product.discountPercentage || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {compareProducts.length < 3 && (
          <div
            className={`rounded-xl shadow-md overflow-hidden border-2 border-dashed ${
              theme === "light"
                ? "bg-gray-50 border-gray-300"
                : "bg-gray-800 border-gray-700"
            } flex items-center justify-center cursor-pointer h-[400px]`}
            onClick={() => setShowAddModal(true)}
          >
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                <FaPlus size={24} />
              </div>
              <p className="font-medium">Ürün Ekle</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Karşılaştırmak için ürün ekleyin
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ürün Ekleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-2xl rounded-xl shadow-lg overflow-hidden ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Karşılaştırmak İçin Ürün Ekle
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchTerm("");
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ürün adı, kategori veya marka ara..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 p-4">
                    <p>Ürünler yüklenirken bir hata oluştu.</p>
                    <p className="text-sm mt-2">{error.message}</p>
                  </div>
                ) : searchTerm.length > 2 ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => addProduct(product)}
                        >
                          <img
                            src={product.thumbnail || "/placeholder.svg"}
                            alt={product.title}
                            className="w-12 h-12 object-contain bg-white p-1 rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {product.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {product.category || "Kategori Yok"} |{" "}
                              {product.brand || "Marka Yok"}
                            </p>
                          </div>
                          <p className="font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {product.price.toFixed(2)} ₺
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        "{searchTerm}" için sonuç bulunamadı
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <FaSearch className="mx-auto text-gray-300 dark:text-gray-600 text-4xl mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Karşılaştırmak istediğiniz ürünü aramak için en az 3
                      karakter girin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareProducts;
