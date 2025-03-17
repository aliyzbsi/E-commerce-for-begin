import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { cityData } from "../services/cityData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaSave,
  FaHome,
  FaBuilding,
} from "react-icons/fa";

function AdresForm({
  adresInfo,
  setAdresInfo,
  selectedAdres,
  setSelectedAdres,
  loggedUser,
}) {
  const [sehirler, setSehirler] = useState(cityData);
  const [ilceler, setIlceler] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
  });

  const watchedCity = watch("city");

  useEffect(() => {
    if (watchedCity) {
      const cityInfo = sehirler.find((sehir) => sehir.il === watchedCity);
      setIlceler(cityInfo ? cityInfo.ilceleri : []);
    }
  }, [watchedCity, sehirler]);

  const adresSubmitFn = (data) => {
    const newAdres = { ...data, userId: loggedUser, id: Date.now() };

    const adresControl = adresInfo.find(
      (item) =>
        item.adresBasligi === data.adresBasligi ||
        item.adresInfo === data.adresInfo
    );

    if (!adresControl) {
      setAdresInfo((prevAdres) => {
        const updatedAdres = [...prevAdres, newAdres];

        setAdresInfo(updatedAdres);
        setSelectedAdres(updatedAdres);

        return updatedAdres;
      });
      setSelectedAdres(data);
      toast.success("Adres kaydedildi");
    } else {
      toast.warning("Bu adres zaten kayıtlı!");
    }
  };

  const savedAdresRemove = (id) => {
    const remove = adresInfo.filter((item) => item.id !== id);
    setAdresInfo(remove);
    toast.success("Adres silindi");
  };

  useEffect(() => {
    if (selectedAdres) {
      reset(selectedAdres);
    }
  }, [selectedAdres, reset]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaMapMarkerAlt />
        Adres Bilgileri
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`
          rounded-lg shadow-md overflow-hidden
          ${theme === "light" ? "bg-white" : "bg-gray-800"}
        `}
        >
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="font-medium">Yeni Adres Ekle</h2>
          </div>

          <form
            onSubmit={handleSubmit(adresSubmitFn)}
            className="p-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  İsim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="İsminizi girin"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("name", {
                    required: "İsim boş bırakılamaz!",
                    minLength: {
                      value: 3,
                      message: "İsim 3 harften kısa olamaz!",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="surname" className="text-sm font-medium">
                  Soyisim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="surname"
                  placeholder="Soyisminizi girin"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("surname", {
                    required: "Soyisim boş bırakılamaz!",
                    minLength: {
                      value: 3,
                      message: "Soyisim 3 harften kısa olamaz!",
                    },
                  })}
                />
                {errors.surname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.surname.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="city" className="text-sm font-medium">
                  İl <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("city", {
                    required: "İl seçimi zorunludur!",
                  })}
                >
                  <option value="">İl Seçin</option>
                  {sehirler.map((sehir, index) => (
                    <option key={index} value={sehir.il}>
                      {sehir.il}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="town" className="text-sm font-medium">
                  İlçe <span className="text-red-500">*</span>
                </label>
                <select
                  id="town"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("town", { required: "İlçe seçimi zorunludur!" })}
                >
                  <option value="">İlçe Seçin</option>
                  {ilceler.map((ilce, index) => (
                    <option key={index} value={ilce}>
                      {ilce}
                    </option>
                  ))}
                </select>
                {errors.town && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.town.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="adresbasligi" className="text-sm font-medium">
                Adres Başlığı <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => reset({ ...watch(), adresBasligi: "Ev" })}
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded-lg text-sm border transition-colors
                    ${
                      watch("adresBasligi") === "Ev"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <FaHome />
                  <span>Ev</span>
                </button>
                <button
                  type="button"
                  onClick={() => reset({ ...watch(), adresBasligi: "İş" })}
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded-lg text-sm border transition-colors
                    ${
                      watch("adresBasligi") === "İş"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <FaBuilding />
                  <span>İş</span>
                </button>
              </div>
              <input
                type="text"
                id="adresbasligi"
                placeholder="Adres Başlığı (Ev, İş vb.)"
                className="w-full mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("adresBasligi", {
                  required: "Adres başlığı girmek zorunludur!",
                  minLength: { value: 2, message: "En az 2 karakter olmalı!" },
                })}
              />
              {errors.adresBasligi && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.adresBasligi.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="adres" className="text-sm font-medium">
                Adres <span className="text-red-500">*</span>
              </label>
              <textarea
                id="adres"
                placeholder="Adres detaylarını girin"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                {...register("adresInfo", {
                  required: "Adres alanı boş bırakılamaz!",
                  minLength: {
                    value: 6,
                    message: "En az 6 karakter girilmelidir!",
                  },
                })}
              />
              {errors.adresInfo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.adresInfo.message}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => navigate("/sepet")}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaArrowLeft />
                <span>Geri Dön</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <FaSave />
                <span>Kaydet</span>
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div
            className={`
            rounded-lg shadow-md overflow-hidden
            ${theme === "light" ? "bg-white" : "bg-gray-800"}
          `}
          >
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="font-medium">Kayıtlı Adreslerim</h2>
            </div>

            <div className="p-4">
              {adresInfo.filter((item) => item.userId === loggedUser).length >
              0 ? (
                <div className="space-y-3">
                  {adresInfo
                    .filter((item) => item.userId === loggedUser)
                    .map((item, index) => (
                      <div
                        key={index}
                        className={`
                          p-3 rounded-lg border transition-colors
                          ${
                            selectedAdres?.id === item.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                          }
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              {item.adresBasligi === "Ev" ? (
                                <FaHome className="text-blue-500" />
                              ) : (
                                <FaBuilding className="text-blue-500" />
                              )}
                              {item.adresBasligi}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {item.name} {item.surname}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.city}/{item.town}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => savedAdresRemove(item.id)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 transition-colors"
                            >
                              <RiDeleteBin5Line size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => setSelectedAdres(item)}
                            className={`
                              px-4 py-1.5 rounded text-sm font-medium transition-colors
                              ${
                                selectedAdres?.id === item.id
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }
                            `}
                          >
                            {selectedAdres?.id === item.id
                              ? "Seçili Adres"
                              : "Bu Adresi Seç"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Kayıtlı adresiniz bulunmamaktadır.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdresForm;
