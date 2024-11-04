import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

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
  const olusturulmaTarihi = new Date(orderDetails.time);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [toplamTutar, setToplamTutar] = useState(0);

  const araToplam = sepet
    .map((item) => item.price * item.adet)
    .reduce((acc, item) => acc + item, 0);

  const hediyeCeki = {
    hediye100: 100,
    hediye200: 200,
    beyzolisko: 1000,
    cimbombom: 1905,
  };
  const kargoBedeli = 50;

  const kodUygula = (data) => {
    const cekKodu = data.hediyeKodu;
    if (hediyeCeki[cekKodu]) {
      setIndirimTutari(hediyeCeki[cekKodu]);
    } else {
      setIndirimTutari(0);
    }
  };

  useEffect(() => {
    const guncelToplamTutar =
      araToplam - indirimTutari < 0
        ? kargoBedeli
        : araToplam - indirimTutari + kargoBedeli;
    setToplamTutar(guncelToplamTutar);
  }, [araToplam, indirimTutari, kargoBedeli, selectedAdres]);
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } flex flex-col gap-8 p-4 max-w-md mx-auto  rounded-lg shadow-lg md:max-w-xl lg:max-w-2xl `}
    >
      <div className="flex gap-4 items-center justify-between">
        <h1 className="font-bold text-2xl ">Sepet Özeti</h1>
        <span className="bg-cyan-100 font-semibold border border-blue-500 px-4 py-2 rounded-full text-blue-500">
          {sepet.length} Ürün
        </span>
      </div>

      <div className="flex flex-col gap-4 font-semibold">
        <div className="border-b border-gray-300 p-2 flex justify-between">
          <span>Ara Toplam:</span>
          <span>{araToplam.toFixed(2)}₺</span>
        </div>
        <div className="border-b border-gray-300 p-2 flex justify-between">
          <span>İndirim Tutarı:</span>
          <span>{indirimTutari}₺</span>
        </div>
        <div className="border-b border-gray-300 p-2 flex justify-between">
          <span>Kargo bedeli:</span>
          <span>{kargoBedeli}₺</span>
        </div>

        <form onSubmit={handleSubmit(kodUygula)} className="mt-4">
          <input
            type="text"
            placeholder="Hediye çeki kodunuz varsa giriniz"
            {...register("hediyeKodu", {
              validate: (value) =>
                hediyeCeki[value] || "Geçersiz hediye çeki kodu",
            })}
            className="border border-gray-300 text-black p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          {errors.hediyeKodu && (
            <p className="text-red-500 mt-1">{errors.hediyeKodu.message}</p>
          )}
          <button
            type="submit"
            className="mt-3 bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-500 transition duration-300"
          >
            Kodu Uygula
          </button>
        </form>

        <div className="border-b border-gray-300 p-2 flex justify-between font-bold ">
          <span>Toplam:</span>
          <span>{toplamTutar.toFixed(2)}₺</span>
        </div>

        {location.pathname === "/sepet" ? (
          <button
            onClick={() =>
              sepet.length > 0
                ? navigate("/sepet/adres")
                : toast.error("Sepetiniz boş!")
            }
            className="mt-4 bg-blue-600 text-white py-3 rounded hover:bg-blue-500 transition duration-300"
          >
            Ürünleri Kontrol Ettim
          </button>
        ) : location.pathname === "/sepet/adres" ? (
          <>
            <button
              onClick={() =>
                selectedAdres
                  ? navigate("/sepet/odeme")
                  : toast.warning("Adres bilgileriniz eksik veya hatalı!")
              }
              className="mt-4 bg-blue-600 text-white py-3 rounded hover:bg-blue-500 transition duration-300"
            >
              Ödemeye Geç
            </button>
            <div className="mt-4">
              {selectedAdres ? (
                <div className="border rounded-lg flex flex-col gap-2 border-gray-300 p-4">
                  <p>
                    <span className="font-bold">Ad Soyad:</span>{" "}
                    {selectedAdres.name} {selectedAdres.surname}
                  </p>
                  <p>
                    <span className="font-bold">Adres Tipi:</span>{" "}
                    {selectedAdres.adresBasligi}
                  </p>
                  <p>
                    <span className="font-bold">Adres:</span>{" "}
                    {selectedAdres.adresInfo}
                  </p>
                  <p>
                    <span className="font-bold">İl / İlçe:</span>{" "}
                    {selectedAdres.city}/{selectedAdres.town}
                  </p>
                </div>
              ) : (
                <p className="text-red-500">
                  Adres giriniz veya kayıtlı adres seçiniz!
                </p>
              )}
            </div>
          </>
        ) : location.pathname === "/sepet/odeme" ? (
          <>
            <button
              onClick={() => {
                if (cardInfo) {
                  setOrderDetails({
                    sepet,
                    selectedAdres,
                    timestamp: Date.now(),
                  });
                  setCardInfo(null);
                  setSepet([]);
                  localStorage.setItem("myCard", JSON.stringify(null));
                  localStorage.setItem("sepet", JSON.stringify([]));
                  navigate("/order-success");
                  toast.success("Sipariş alındı");
                } else {
                  setCardInfo(null);
                  localStorage.setItem("myCard", JSON.stringify(null));
                  toast.warning("Kart bilgileriniz eksik veya hatalı!");
                }
              }}
              className="mt-4 bg-blue-600 text-white py-3 rounded hover:bg-blue-500 transition duration-300"
            >
              Ödemeyi Yap
            </button>
            <div className="mt-4">
              {selectedAdres ? (
                <div className="border rounded-lg flex flex-col gap-2 border-gray-300 p-4">
                  <p>
                    <span className="font-bold">Ad Soyad:</span>{" "}
                    {selectedAdres.name} {selectedAdres.surname}
                  </p>
                  <p>
                    <span className="font-bold">Adres Tipi:</span>{" "}
                    {selectedAdres.adresBasligi}
                  </p>
                  <p>
                    <span className="font-bold">Adres:</span>{" "}
                    {selectedAdres.adresInfo}
                  </p>
                  <p>
                    <span className="font-bold">İl / İlçe:</span>{" "}
                    {selectedAdres.city}/{selectedAdres.town}
                  </p>
                </div>
              ) : (
                <p className="text-red-500">
                  Adres giriniz veya kayıtlı adres seçiniz!
                </p>
              )}
            </div>
          </>
        ) : (
          <p>Adres bilgileri</p>
        )}
      </div>
    </div>
  );
}

export default SepetSidebar;
