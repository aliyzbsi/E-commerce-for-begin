import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStar, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import FavoriteButton from "./FavoriteButton";

function FeaturedProducts({ sepet, setSepet, loggedUser }) {
  const navigate = useNavigate();

  // Ürünleri getir
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProduct,
  });

  // İndirimli fiyat hesaplama
  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage) / 100;
  };

  // Sepete ekle
  const addToCart = (product) => {
    if (!loggedUser) {
      toast.info("Sepete eklemek için giriş yapmalısınız");
      navigate("/login");
      return;
    }

    const existingProduct = sepet.find((item) => item.id === product.id);

    if (existingProduct) {
      const updatedCart = sepet.map((item) =>
        item.id === product.id ? { ...item, adet: item.adet + 1 } : item
      );
      setSepet(updatedCart);
      toast.success("Ürün adedi artırıldı");
    } else {
      setSepet([...sepet, { ...product, adet: 1 }]);
      toast.success("Ürün sepete eklendi");
    }
  };

  // En çok indirimli ürünleri getir
  const discountedProducts = products
    .filter((product) => product.discountPercentage > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 4);

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
        <p>Ürünler yüklenirken bir hata oluştu.</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Öne Çıkan İndirimler</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {discountedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col h-full transform transition-transform hover:shadow-lg"
          >
            <div className="relative">
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

              <div className="absolute top-2 right-2">
                <FavoriteButton product={product} />
              </div>

              <div className="absolute top-2 left-2">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  %{Math.round(product.discountPercentage)} İndirim
                </span>
              </div>
            </div>

            <div className="p-4 flex-grow">
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <h3 className="font-medium line-clamp-2 h-12 mb-2">
                  {product.title}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(product.rating)
                            ? ""
                            : "text-gray-300 dark:text-gray-600"
                        }
                        size={14}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({product.rating})
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {calculateDiscountedPrice(
                      product.price,
                      product.discountPercentage
                    ).toFixed(2)}{" "}
                    ₺
                  </span>
                  <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                    {product.price.toFixed(2)} ₺
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  <span>Sepete Ekle</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
