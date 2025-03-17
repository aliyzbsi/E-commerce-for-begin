import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import {
  FaTag,
  FaMapMarkerAlt,
  FaTruck,
  FaPercent,
  FaCreditCard,
} from "react-icons/fa";

function SepetSidebar({
  sepet,
  setSepet,
  selectedAdres,
  cardInfo,
  setCardInfo,
  orderDetails,
  setOrderDetails,
}) {
  const [indirimTutari, setIndirimTutari] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [toplamTutar, setToplamTutar] = useState(0);

  const araToplam =
    sepet && sepet.length > 0
      ? sepet
          .map(
            (item) =>
              (item.price - (item.price * item.discountPercentage) / 100) *
              item.adet
          )
          .reduce((acc, item) => acc + item, 0)
      : 0;

  const hediyeCeki = {
    hediye100: 100,
    hediye200: 200,
    cimbombom: 1905,
  };

  const kargoBedeli = 50;

  const kodUygula = (data) => {
    const cekKodu = data.hediyeKodu;
    if (hediyeCeki[cekKodu]) {
      setIndirimTutari(hediyeCeki[cekKodu]);
      toast.success(`${cekKodu} kodu uygulandı!`);
    } else {
      setIndirimTutari(0);
      toast.error("Geçersiz hediye çeki kodu!");
    }
  };

  useEffect(() => {
    const guncelToplamTutar =
      araToplam - indirimTutari < 0
        ? kargoBedeli
        : araToplam - indirimTutari + kargoBedeli;
    setToplamTutar(guncelToplamTutar);
  }, [araToplam, indirimTutari, kargoBedeli, selectedAdres]);

  const handleButtonClick = () => {
    if (location.pathname === "/sepet") {
      if (sepet.length > 0) {
        // Stok kontrolü yapalım
        const stokHatasi = sepet.find((item) => item.adet > item.stock);
        if (stokHatasi) {
          toast.error(
            `"${stokHatasi.title}" ürününden en fazla ${stokHatasi.stock} adet sipariş verebilirsiniz!`
          );
          return;
        }
        navigate("/sepet/adres");
      } else {
        toast.error("Sepetiniz boş!");
      }
    } else if (location.pathname === "/sepet/adres") {
      if (selectedAdres) {
        // Stok kontrolü yapalım
        const stokHatasi = sepet.find((item) => item.adet > item.stock);
        if (stokHatasi) {
          toast.error(
            `"${stokHatasi.title}" ürününden en fazla ${stokHatasi.stock} adet sipariş verebilirsiniz!`
          );
          return;
        }
        navigate("/sepet/odeme");
      } else {
        toast.warning("Adres bilgileriniz eksik veya hatalı!");
      }
    } else if (location.pathname === "/sepet/odeme") {
      if (cardInfo) {
        // Son bir kez daha stok kontrolü yapalım
        const stokHatasi = sepet.find((item) => item.adet > item.stock);
        if (stokHatasi) {
          toast.error(
            `"${stokHatasi.title}" ürününden en fazla ${stokHatasi.stock} adet sipariş verebilirsiniz!`
          );
          return;
        }

        // Sipariş detaylarını oluştur
        const newOrder = {
          sepet: [...sepet], // Sepet verilerinin kopyasını al
          selectedAdres,
          timestamp: Date.now(),
        };

        // Sipariş detaylarını state'e ekle
        setOrderDetails((prevOrders) => {
          const existingOrders = Array.isArray(prevOrders) ? prevOrders : [];
          return [...existingOrders, newOrder];
        });

        // Sipariş detaylarını localStorage'a da kaydet
        localStorage.setItem("lastOrder", JSON.stringify(newOrder));

        // Kart bilgilerini ve sepeti temizle
        setCardInfo(null);
        setSepet([]);
        localStorage.setItem("myCard", JSON.stringify(null));
        localStorage.setItem("sepet", JSON.stringify([]));

        // Başarı sayfasına yönlendir
        navigate("/order-success");
        toast.success("Sipariş alındı");
      } else {
        setCardInfo(null);
        localStorage.setItem("myCard", JSON.stringify(null));
        toast.warning("Kart bilgileriniz eksik veya hatalı!");
      }
    }
  };

  return (
    <div
      className={`
      rounded-lg overflow-hidden shadow-md
      ${theme === "light" ? "bg-white" : "bg-gray-800"}
    `}
    >
      <div className="bg-blue-600 p-4 text-white">
        <h2 className="text-lg font-bold">Sipariş Özeti</h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <FaTag className="text-blue-500" />
            Ara Toplam:
          </span>
          <span className="font-medium">{araToplam.toFixed(2)} ₺</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <FaPercent className="text-green-500" />
            İndirim:
          </span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {indirimTutari > 0 ? `-${indirimTutari.toFixed(2)} ₺` : "0.00 ₺"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <FaTruck className="text-blue-500" />
            Kargo:
          </span>
          <span className="font-medium">{kargoBedeli.toFixed(2)} ₺</span>
        </div>

        <form onSubmit={handleSubmit(kodUygula)} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Hediye çeki kodunuz"
              {...register("hediyeKodu")}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.hediyeKodu && (
              <p className="text-red-500 text-xs mt-1">
                {errors.hediyeKodu.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Kodu Uygula
          </button>
        </form>

        <div className="flex justify-between items-center py-3 border-b dark:border-gray-700 font-bold">
          <span>Toplam:</span>
          <span className="text-xl text-blue-600 dark:text-blue-400">
            {toplamTutar.toFixed(2)} ₺
          </span>
        </div>

        {selectedAdres &&
          (location.pathname === "/sepet/adres" ||
            location.pathname === "/sepet/odeme") && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                Teslimat Adresi
              </h3>
              <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <p>
                  <span className="font-medium">Ad Soyad:</span>{" "}
                  {selectedAdres.name} {selectedAdres.surname}
                </p>
                <p>
                  <span className="font-medium">Adres Tipi:</span>{" "}
                  {selectedAdres.adresBasligi}
                </p>
                <p>
                  <span className="font-medium">Adres:</span>{" "}
                  {selectedAdres.adresInfo}
                </p>
                <p>
                  <span className="font-medium">İl/İlçe:</span>{" "}
                  {selectedAdres.city}/{selectedAdres.town}
                </p>
              </div>
            </div>
          )}

        {cardInfo && location.pathname === "/sepet/odeme" && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <FaCreditCard className="text-blue-500" />
              Ödeme Bilgileri
            </h3>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-medium">Kart Sahibi:</span>{" "}
                {cardInfo.kartSahAdSoyad}
              </p>
              <p>
                <span className="font-medium">Kart Numarası:</span> **** ****
                **** {cardInfo.kkNo.slice(-4)}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleButtonClick}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {location.pathname === "/sepet" && "Ürünleri Kontrol Et"}
          {location.pathname === "/sepet/adres" && "Ödemeye Geç"}
          {location.pathname === "/sepet/odeme" && "Siparişi Tamamla"}
        </button>
      </div>
    </div>
  );
}

export default SepetSidebar;
