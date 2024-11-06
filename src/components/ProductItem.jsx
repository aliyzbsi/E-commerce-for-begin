import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSelectedProduct } from "../services/apiService";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

function ProductItem({ sepet, setSepet }) {
  const { id } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSelectedProduct(id),
  });

  const sepeteEkle = (product) => {
    const urun = sepet.find((urun) => urun.id === product.id);
    if (urun) {
      const yeniSepet = sepet.map((urunItem) =>
        urunItem.id === product.id
          ? { ...urunItem, adet: urunItem.adet + 1 }
          : urunItem
      );
      setSepet(yeniSepet);
    } else {
      setSepet([...sepet, { ...product, adet: 1 }]);
    }
  };
  const { theme } = useTheme();
  if (isLoading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata oluştu: {error.message}</p>;

  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } flex flex-col p-4 md:flex-row md:justify-between md:p-8  rounded-lg shadow-lg max-w-screen-lg mx-auto `}
    >
      <div className="md:w-1/2 flex justify-center mb-4 md:mb-0">
        <img
          src={product.image}
          className="w-full max-w-md border-2 border-gray-300 p-4 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
          alt={product.title}
        />
      </div>

      <div className="md:w-1/2 flex flex-col justify-between p-6 border-2 border-gray-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="font-semibold text-2xl text-green-700">
            {product.price}₺
          </p>
          <button
            onClick={() => sepeteEkle(product)}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-500 transition duration-300 transform hover:scale-105"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
