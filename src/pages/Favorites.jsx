"use client";

import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeContext";
import { FaHeart, FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

function Favorites({ sepet, setSepet, loggedUser }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { favorites, removeFromFavorites } = useFavorites();

  const AddSepet = (item) => {
    if (!loggedUser) {
      toast.info("Sepete eklemek için giriş yapmalısınız");
      navigate("/login", { state: { from: "/favorites" } });
      return;
    }

    const urunIndex = sepet.findIndex((urun) => urun.id === item.id);
    if (urunIndex !== -1) {
      const yeniSepet = [...sepet];
      yeniSepet[urunIndex].adet += 1;
      setSepet(yeniSepet);
      toast.success("Ürün adedi artırıldı");
    } else {
      setSepet([...sepet, { ...item, adet: 1 }]);
      toast.success("Ürün sepete eklendi");
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <FaHeart className="text-6xl text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Favori Listeniz Boş</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Henüz favori ürün eklemediniz.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          Alışverişe Başla
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FaHeart className="text-red-500" />
        Favorilerim ({favorites.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((item) => (
          <div
            key={item.id}
            className={`
              rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300
              ${theme === "light" ? "bg-white" : "bg-gray-800"}
            `}
          >
            <div className="p-4 flex gap-4">
              <div
                className="w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center cursor-pointer flex-shrink-0"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  src={item.images[0] || "/placeholder.svg"}
                  className="max-h-full max-w-full object-contain"
                  alt={item.title}
                />
              </div>

              <div className="flex-grow min-w-0">
                <h3
                  className="font-medium mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {item.category}
                </p>
                <p className="font-bold text-blue-600 dark:text-blue-400">
                  {item.price.toFixed(2)} ₺
                </p>
              </div>
            </div>

            <div className="flex border-t dark:border-gray-700">
              <button
                onClick={() => removeFromFavorites(item.id)}
                className="flex-1 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1"
              >
                <FaTrashAlt />
                <span>Kaldır</span>
              </button>

              <button
                onClick={() => AddSepet(item)}
                className="flex-1 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-1"
              >
                <FaShoppingCart />
                <span>Sepete Ekle</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
