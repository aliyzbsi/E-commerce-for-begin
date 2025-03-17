import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

function Products({ products, sepet, setSepet, loggedUser }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = useLocation();

  const AddSepet = (item) => {
    if (!loggedUser) {
      toast.info("Sepete eklemek için giriş yapmalısınız");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const urunIndex = sepet.findIndex((urun) => urun.id === item.id);
    if (urunIndex !== -1) {
      // Stok kontrolü ekleyelim
      const currentAmount = sepet[urunIndex].adet;
      if (currentAmount >= item.stock) {
        toast.warning(`Bu üründen en fazla ${item.stock} adet alabilirsiniz!`);
        return;
      }

      const yeniSepet = [...sepet];
      yeniSepet[urunIndex].adet += 1;
      setSepet(yeniSepet);
      toast.success("Ürün adedi artırıldı");
    } else {
      // Stok kontrolü
      if (item.stock <= 0) {
        toast.error("Bu ürün stokta bulunmamaktadır!");
        return;
      }

      setSepet([...sepet, { ...item, adet: 1 }]);
      toast.success("Ürün sepete eklendi");
    }
  };

  // İndirimli fiyat hesaplama
  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage) / 100;
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((item) => {
        // Ürün verilerini kontrol edelim
        if (!item || typeof item !== "object" || !item.id) {
          console.warn("Geçersiz ürün verisi:", item);
          return null;
        }

        // Ürün resmi
        const productImage =
          item.thumbnail || item.images?.[0] || "/placeholder.svg";

        // Ürün puanı
        const rating =
          typeof item.rating === "number"
            ? item.rating
            : item.rating && typeof item.rating === "object" && item.rating.rate
            ? item.rating.rate
            : 0;

        return (
          <div
            key={item.id}
            className={`
              rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col
              ${theme === "light" ? "bg-white" : "bg-gray-800"}
            `}
          >
            <div
              className="cursor-pointer flex flex-col relative"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              {/* Kategori etiketi */}
              <span className="absolute top-2 left-2 z-10 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                {typeof item.category === "object"
                  ? item.category.name ||
                    item.category.slug ||
                    JSON.stringify(item.category)
                  : item.category}
              </span>

              {/* İndirim etiketi */}
              {item.discountPercentage > 0 && (
                <span className="absolute top-2 right-2 z-10 text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-full">
                  %{Math.round(item.discountPercentage)} İndirim
                </span>
              )}

              {/* Stok durumu */}
              {item.stock <= 5 && item.stock > 0 && (
                <span className="absolute bottom-2 left-2 z-10 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
                  Son {item.stock} ürün
                </span>
              )}

              {/* Ürün görseli */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={productImage || "/placeholder.svg"}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </div>

              <div className="absolute top-2 right-2">
                <FavoriteButton product={item} />
              </div>

              <div className="p-4">
                {/* Marka */}
                <div className="flex items-center gap-1 mb-1">
                  <FaTag className="text-gray-400 text-xs" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {typeof item.brand === "object"
                      ? item.brand.name ||
                        item.brand.slug ||
                        JSON.stringify(item.brand)
                      : item.brand}
                  </span>
                </div>

                {/* Ürün başlığı */}
                <h3 className="font-medium line-clamp-2 h-12 mb-2">
                  {item.title}
                </h3>

                {/* Ürün açıklaması */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2 h-10">
                  {item.description}
                </p>

                {/* Ürün puanı */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;

                      // Tam yıldız
                      if (ratingValue <= Math.floor(rating)) {
                        return <FaStar key={index} className="text-xs" />;
                      }
                      // Yarım yıldız
                      else if (ratingValue - 0.5 <= rating) {
                        return (
                          <FaStarHalfAlt key={index} className="text-xs" />
                        );
                      }
                      // Boş yıldız
                      else {
                        return (
                          <FaStar
                            key={index}
                            className="text-xs text-gray-300 dark:text-gray-600"
                          />
                        );
                      }
                    })}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({rating.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 mt-auto border-t dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  {item.discountPercentage > 0 ? (
                    <div>
                      <p className="text-sm line-through text-gray-500 dark:text-gray-400">
                        {item.price.toFixed(2)} ₺
                      </p>
                      <p className="font-bold text-lg text-red-600 dark:text-red-400">
                        {calculateDiscountedPrice(
                          item.price,
                          item.discountPercentage
                        ).toFixed(2)}{" "}
                        ₺
                      </p>
                    </div>
                  ) : (
                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {item.price.toFixed(2)} ₺
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    AddSepet(item);
                  }}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium
                    ${
                      item.stock === 0
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }
                  `}
                  disabled={item.stock === 0}
                >
                  <FaShoppingCart />
                  <span>{item.stock === 0 ? "Tükendi" : "Sepete Ekle"}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Products;
