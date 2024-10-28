import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { cityData } from "../services/cityData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { RiDeleteBin5Line } from "react-icons/ri";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    const cityInfo = sehirler.find((sehir) => sehir.il === selectedCity);
    setIlceler(cityInfo ? cityInfo.ilceleri : []);
  };

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
      toast.warning("Bu adres zaten kayıtlı !");
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
  }, [selectedAdres]);

  return (
    <div className="flex flex-col justify-center gap-4 md:flex-row mt-10">
      <div className="border border-gray-300 shadow-lg rounded-lg p-8 bg-white w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Adres Bilgileri
        </h1>
        <form onSubmit={handleSubmit(adresSubmitFn)} className="space-y-6">
          {/* İsim ve Soyisim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="firstName"
                className="text-sm font-semibold text-gray-600"
              >
                İsim <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="İsminizi girin"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
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

            <div className="flex flex-col">
              <label
                htmlFor="surname"
                className="text-sm font-semibold text-gray-600"
              >
                Soyisim <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="surname"
                placeholder="Soyisminizi girin"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
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

          {/* İl ve İlçe Seçimi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="city"
                className="text-sm font-semibold text-gray-600"
              >
                İl <span className="text-red-500">*</span>
              </label>
              <select
                id="city"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
                {...register("city", {
                  required: "İl seçimi zorunludur!",
                  onChange: handleCityChange,
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

            <div className="flex flex-col">
              <label
                htmlFor="town"
                className="text-sm font-semibold text-gray-600"
              >
                İlçe <span className="text-red-500">*</span>
              </label>
              <select
                id="town"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
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

          {/* Adres ve Adres Başlığı */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="adresbasligi"
              className="text-sm font-semibold text-gray-600"
            >
              Adres Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="adresbasligi"
              placeholder="Adres Başlığı"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
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

            <label
              htmlFor="adres"
              className="text-sm font-semibold text-gray-600"
            >
              Adres <span className="text-red-500">*</span>
            </label>
            <textarea
              id="adres"
              placeholder="Adres"
              className="border border-gray-300 h-20 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
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

          {/* Kaydet-Vazgeç Butonu */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/sepet")}
              className="text-gray-600 hover:text-blue-600 transform transition duration-300"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-4 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transform transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
      {/* Kayıtlı adresleri göster */}
      <div className="flex flex-col gap-2 mt-4 w-full max-w-lg mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Kayıtlı Adresler
        </h2>
        {adresInfo
          .filter((item) => item.userId === loggedUser)
          .map((item, index) => (
            <div key={index} className="flex gap-4">
              <button
                onClick={() => setSelectedAdres(item)}
                className="bg-blue-600 text-center hover:bg-blue-500 p-2 text-white rounded-lg w-full text-left transition duration-200 ease-in-out"
              >
                {item.adresBasligi}
              </button>
              <button
                onClick={() => savedAdresRemove(item.id)}
                className="transform transition duration-300 hover:scale-125"
              >
                <RiDeleteBin5Line size={25} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AdresForm;
