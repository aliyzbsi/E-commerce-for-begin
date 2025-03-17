import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { FaTruckArrowRight } from "react-icons/fa6";

function SuccessOrder({ orderDetails = {} }) {
  const {
    sepet = [],
    selectedAdres = {},
    timestamp = Date.now(),
  } = orderDetails;

  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (sepet.length === 0) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [sepet, navigate]);

  const toplamTutar = sepet.reduce(
    (total, item) => total + item.price * item.adet + 50,
    0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Siparişiniz Alındı!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Siparişiniz başarıyla oluşturuldu ve en kısa sürede hazırlanacak.
        </p>
      </div>

      <div
        className={`
        rounded-lg shadow-md overflow-hidden mb-6
        ${theme === "light" ? "bg-white" : "bg-gray-800"}
      `}
      >
        <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
          <h2 className="font-medium flex items-center gap-2">
            <FaCalendarAlt />
            Sipariş Özeti
          </h2>
          <p className="text-sm">{new Date(timestamp).toLocaleString()}</p>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {sepet.length > 0 ? (
              sepet.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-16 h-16 bg-white rounded-md p-2 flex items-center justify-center">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : item.thumbnail || "/placeholder.svg"
                      }
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.adet} adet x {item.price.toFixed(2)} ₺
                    </p>
                  </div>
                  <p className="font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {(item.price * item.adet).toFixed(2)} ₺
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Sipariş detayları bulunamadı.
              </p>
            )}
          </div>

          {sepet.length > 0 && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700 flex flex-col justify-between ">
              <div className="flex flex-col gap-2 border-2">
                <span className=" flex justify-between p-2 font-bold text-lg">
                  <span className="flex items-center gap-2">
                    <FaTruckArrowRight />
                    Kargo Ücreti :{" "}
                  </span>
                  <span>50 ₺</span>{" "}
                </span>
                <span className="font-medium flex justify-between p-2">
                  Toplam Tutar:{" "}
                  <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                    {toplamTutar.toFixed(2)} ₺
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`
        rounded-lg shadow-md overflow-hidden mb-6
        ${theme === "light" ? "bg-white" : "bg-gray-800"}
      `}
      >
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="font-medium flex items-center gap-2">
            <FaMapMarkerAlt />
            Teslimat Adresi
          </h2>
        </div>

        <div className="p-4">
          {selectedAdres ? (
            <div className="space-y-2">
              <p>
                <span className="font-medium">Ad Soyad:</span>{" "}
                <span>
                  {selectedAdres.name} {selectedAdres.surname}
                </span>
              </p>
              <p>
                <span className="font-medium">Adres Tipi:</span>{" "}
                <span>{selectedAdres.adresBasligi}</span>
              </p>
              <p>
                <span className="font-medium">Adres:</span>{" "}
                <span>{selectedAdres.adresInfo}</span>
              </p>
              <p>
                <span className="font-medium">İl / İlçe:</span>{" "}
                <span>
                  {selectedAdres.city}/{selectedAdres.town}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Adres bilgileri bulunamadı.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <FaArrowLeft />
          <span>Alışverişe Devam Et</span>
        </button>
      </div>
    </div>
  );
}

export default SuccessOrder;
