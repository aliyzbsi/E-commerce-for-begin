import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaShoppingCart, FaMinus, FaPlus, FaArrowRight } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";

function Basket({ sepet, setSepet, loggedUser }) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // İndirimli fiyat hesaplama
  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage) / 100;
  };

  const urunBirak = (id) => {
    const urun = sepet.find((item) => item.id === id);

    if (urun && urun.adet > 1) {
      const yeniSepet = sepet.map((item) =>
        item.id === id ? { ...item, adet: item.adet - 1 } : item
      );
      setSepet(yeniSepet);
      toast.info("Ürün adedi azaltıldı");
    } else {
      urunCikar(id);
    }
  };

  const urunEkle = (id) => {
    const urun = sepet.find((item) => item.id === id);

    // Stok kontrolü
    if (urun && urun.adet >= urun.stock) {
      toast.warning(`Bu üründen en fazla ${urun.stock} adet alabilirsiniz.`);
      return;
    }

    const yeniSepet = sepet.map((urun) =>
      urun.id === id ? { ...urun, adet: urun.adet + 1 } : urun
    );
    setSepet(yeniSepet);
    toast.success("Ürün adedi artırıldı");
  };

  const urunCikar = (id) => {
    const yeniSepet = sepet.filter((item) => item.id !== id);
    setSepet(yeniSepet);
    toast.error("Ürün sepetten çıkarıldı");
  };

  // İndirimli fiyatları da hesaba katarak toplam tutarı hesapla
  const toplamTutar = sepet.reduce((total, item) => {
    const itemPrice = item.discountPercentage
      ? calculateDiscountedPrice(item.price, item.discountPercentage)
      : item.price;
    return total + itemPrice * item.adet;
  }, 0);

  useEffect(() => {
    if (!loggedUser) {
      navigate("/login", { state: { from: "/sepet" } });
      toast.info("Sepeti görüntülemek için giriş yapmalısınız");
    }
  }, [loggedUser, navigate]);

  if (sepet.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <FaShoppingCart className="text-6xl text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Sepetiniz Boş</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Sepetinizde henüz ürün bulunmuyor.
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaShoppingCart />
          Sepetim ({sepet.length})
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          "hediye100" ve "hediye200" kodları ile sepette indirim yapabilirsiniz
        </p>
      </div>

      <div className="space-y-4">
        {sepet.map((item) => (
          <div
            key={item.id}
            className={`
              rounded-lg overflow-hidden shadow-md
              ${theme === "light" ? "bg-white" : "bg-gray-800"}
            `}
          >
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <div
                className="flex-shrink-0 w-full sm:w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  src={item.thumbnail || "/placeholder.svg"}
                  className="max-h-full max-w-full object-contain"
                  alt={item.title}
                />
              </div>

              <div className="flex-grow min-w-0">
                <h3
                  className="font-medium mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded">
                    {item.brand}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => urunBirak(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-l-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center bg-gray-50 dark:bg-gray-800 font-medium">
                      {item.adet}
                    </span>
                    <button
                      onClick={() => urunEkle(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      disabled={item.adet >= item.stock}
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    {item.discountPercentage > 0 ? (
                      <div>
                        <p className="text-sm line-through text-gray-500 dark:text-gray-400">
                          {(item.price * item.adet).toFixed(2)} ₺
                        </p>
                        <p className="font-bold text-red-600 dark:text-red-400">
                          {(
                            calculateDiscountedPrice(
                              item.price,
                              item.discountPercentage
                            ) * item.adet
                          ).toFixed(2)}{" "}
                          ₺
                        </p>
                      </div>
                    ) : (
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        {(item.price * item.adet).toFixed(2)} ₺
                      </p>
                    )}
                    <button
                      onClick={() => urunCikar(item.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 transition-colors"
                    >
                      <RiDeleteBinLine size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`
        p-4 rounded-lg shadow-md mt-6 flex flex-col sm:flex-row justify-between items-center gap-4
        ${theme === "light" ? "bg-white" : "bg-gray-800"}
      `}
      >
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Toplam Tutar
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {toplamTutar.toFixed(2)} ₺
          </p>
        </div>

        <button
          onClick={() => navigate("/sepet/adres")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <span>Alışverişi Tamamla</span>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Basket;
