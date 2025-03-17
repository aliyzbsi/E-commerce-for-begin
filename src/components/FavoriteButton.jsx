import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import { toast } from "react-toastify";

function FavoriteButton({ product, className = "" }) {
  const { isInFavorites, addToFavorites, removeFromFavorites } = useFavorites();
  const isFavorite = isInFavorites(product.id);

  const toggleFavorite = (e) => {
    e.stopPropagation();

    if (isFavorite) {
      removeFromFavorites(product.id);
      toast.info("Ürün favorilerden çıkarıldı");
    } else {
      addToFavorites(product);
      toast.success("Ürün favorilere eklendi");
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-colors ${className} ${
        isFavorite
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      {isFavorite ? (
        <FaHeart className="text-lg" />
      ) : (
        <FaRegHeart className="text-lg" />
      )}
    </button>
  );
}

export default FavoriteButton;
