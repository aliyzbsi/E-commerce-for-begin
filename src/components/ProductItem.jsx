import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSelectedProduct } from "../services/api";
import ProductDetail from "./ProductDetail";
import { FaSpinner } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";

function ProductItem({ sepet, setSepet, loggedUser }) {
  const { id } = useParams();
  const { isInFavorites, addToFavorites, removeFromFavorites } = useFavorites();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSelectedProduct(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Ürün yüklenirken bir hata oluştu.</p>
        <p className="text-sm mt-2">{error?.message || "Ürün bulunamadı"}</p>
      </div>
    );
  }

  const toggleFavorite = () => {
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const addToCart = (product) => {
    // Sepete ekleme mantığı
    const existingProduct = sepet.find((item) => item.id === product.id);

    if (existingProduct) {
      const updatedCart = sepet.map((item) =>
        item.id === product.id ? { ...item, adet: item.adet + 1 } : item
      );
      setSepet(updatedCart);
    } else {
      setSepet([...sepet, { ...product, adet: 1 }]);
    }
  };

  return (
    <ProductDetail
      product={product}
      addToCart={addToCart}
      isInFavorites={isInFavorites(product.id)}
      toggleFavorite={toggleFavorite}
    />
  );
}

export default ProductItem;
