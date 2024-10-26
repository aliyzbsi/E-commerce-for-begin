import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSelectedProduct } from "../services/apiService";

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

  if (isLoading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata oluştu: {error.message}</p>;

  return (
    <div className="flex flex-col p-4 md:flex-row md:justify-between md:p-8">
      <div className="md:w-1/2 flex justify-center mb-4 md:mb-0">
        <img
          src={product.image}
          className="w-full max-w-md border-2 p-4 rounded-lg shadow-md transform transition duration-300 hover:scale-125"
          alt={product.title}
        />
      </div>
      <div className="md:w-1/2 flex flex-col justify-between p-4 border-2 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-xl">{product.price}₺</p>
          <button
            onClick={() => sepeteEkle(product)}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-400 transition duration-300"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
