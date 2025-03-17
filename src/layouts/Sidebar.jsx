import { useQuery } from "@tanstack/react-query";
import { getProductById, getProductsByCategory } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import SepetSidebar from "../components/SepetSidebar";
import { useTheme } from "../context/ThemeContext";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Bell, Heart } from "lucide-react";

function Sidebar({
  sepet,
  setSepet,
  selectedAdres,
  setCardInfo,
  cardInfo,
  orderDetails,
  setOrderDetails,
  loggedUser,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // URL'den ürün ID'sini çıkar
  const isProductPage = location.pathname.startsWith("/product/");
  const productId = isProductPage ? location.pathname.split("/")[2] : null;

  // Mevcut ürünün detaylarını al
  const {
    data: productDetail,
    isLoading: isLoadingProduct,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId, // Sadece productId varsa çalıştır
  });

  // Ürünün kategorisindeki diğer ürünleri al
  const {
    data: relatedProducts = [],
    isLoading: isLoadingRelated,
    error: relatedError,
  } = useQuery({
    queryKey: ["relatedProducts", productDetail?.category],
    queryFn: () => getProductsByCategory(productDetail?.category),
    enabled: !!productDetail?.category, // Sadece kategori bilgisi varsa çalıştır
  });

  // Debug için konsola yazdır
  useEffect(() => {
    if (productDetail) {
      console.log("Ürün detayı:", productDetail);
      console.log("Ürün kategorisi:", productDetail.category);
    }
    if (relatedProducts) {
      console.log("İlgili ürünler:", relatedProducts);
    }
  }, [productDetail, relatedProducts]);

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const savedFavorites = localStorage.getItem("favorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    }
    return [];
  });

  const [notification, setNotification] = useState(() => {
    if (typeof window !== "undefined") {
      const userNotifications = localStorage.getItem("notifications");
      return userNotifications ? JSON.parse(userNotifications) : [];
    }
    if (notification === null) {
      setNotification(["Okunmamış Bildiriminiz Yoktur"]);
    }
    return [];
  });

  // Sepete ürün ekleme fonksiyonu
  const addToCart = (item) => {
    if (!loggedUser) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const existingItem = sepet.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      // Ürün zaten sepette, adet artır
      const updatedCart = sepet.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, adet: cartItem.adet + 1 }
          : cartItem
      );
      setSepet(updatedCart);
      localStorage.setItem("sepet", JSON.stringify(updatedCart));
    } else {
      // Yeni ürün ekle
      const updatedCart = [...sepet, { ...item, adet: 1 }];
      setSepet(updatedCart);
      localStorage.setItem("sepet", JSON.stringify(updatedCart));
    }
  };

  const renderSidebarContent = () => {
    if (location.pathname === "/") {
      return (
        <div>
          <div className="p-4 font-bold text-lg border-b flex items-center gap-4 text-blue-600">
            <p>BİLDİRİMLERİN</p>
            <Bell />
          </div>
          {notification.map((not, index) => (
            <div key={index} className="p-2 border-b">
              <p>{not}</p>
            </div>
          ))}
          <div className="p-4 font-bold text-lg border-b flex items-center gap-4 text-red-600">
            <p>FAVORİ LİSTEN</p>
            <Heart />
          </div>
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex items-center p-2 border-b hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate(`/product/${favorite.id}`)}
            >
              <img
                src={
                  favorite.images?.[0] ||
                  favorite.thumbnail ||
                  "/placeholder.svg"
                }
                className="w-16 h-16 object-contain mr-2"
                alt={favorite.title}
              />
              <div>
                <p className="font-medium truncate">{favorite.title}</p>
                <p className="text-blue-600 dark:text-blue-400 font-bold">
                  {favorite.price?.toFixed(2)} ₺
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isProductPage) {
      // İlgili ürünleri filtrele (mevcut ürünü hariç tut ve en fazla 5 ürün göster)
      const filteredRelatedProducts = Array.isArray(relatedProducts)
        ? relatedProducts
            .filter((item) => item.id.toString() !== productId)
            .slice(0, 5)
        : [];

      return (
        <div>
          <div className="p-4 font-bold text-lg border-b flex items-center gap-2 text-blue-600">
            <p>Bunlar da Dikkatinizi Çekebilir</p>
          </div>

          {isLoadingProduct || isLoadingRelated ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Ürünler yükleniyor...
              </p>
            </div>
          ) : productError || relatedError ? (
            <div className="p-4 text-center text-red-500">
              <p>Ürünler yüklenirken bir hata oluştu.</p>
              {productError && (
                <p className="text-xs">{productError.message}</p>
              )}
              {relatedError && (
                <p className="text-xs">{relatedError.message}</p>
              )}
            </div>
          ) : filteredRelatedProducts.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {filteredRelatedProducts.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={
                        item.images?.[0] || item.thumbnail || "/placeholder.svg"
                      }
                      alt={item.title}
                      className="w-16 h-16 object-contain bg-white rounded-md p-1"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.brand}
                      </p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {item.price?.toFixed(2)} ₺
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-2 w-full py-1.5 px-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <FaShoppingCart size={12} />
                    <span>Sepete Ekle</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p>Bu kategoride başka ürün bulunamadı.</p>
            </div>
          )}
        </div>
      );
    }

    if (
      location.pathname === "/sepet" ||
      location.pathname === "/sepet/odeme" ||
      location.pathname === "/sepet/adres"
    ) {
      return (
        <SepetSidebar
          sepet={sepet}
          selectedAdres={selectedAdres}
          cardInfo={cardInfo}
          setCardInfo={setCardInfo}
          setSepet={setSepet}
          orderDetails={orderDetails}
          setOrderDetails={setOrderDetails}
        />
      );
    }
  };

  return (
    <aside
      className={`
      w-full md:w-1/3 lg:w-1/4 h-fit top-24 
      ${theme === "light" ? "bg-white" : "bg-gray-800"}
      rounded-xl shadow-md overflow-hidden transition-colors duration-300
    `}
    >
      {renderSidebarContent()}
    </aside>
  );
}

export default Sidebar;
