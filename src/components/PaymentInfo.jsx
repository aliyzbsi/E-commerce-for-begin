import { useForm } from "react-hook-form";
import chipImage from "../assets/chip.png";
import { RiVisaLine } from "react-icons/ri";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock } from "react-icons/fa";

function PaymentInfo({ setCardInfo }) {
  const { theme } = useTheme();
  const [cvcActive, setCvcActive] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      kkNo: "",
      kartSahAdSoyad: "",
      ay: "",
      yil: "",
      cvc: "",
    },
  });

  const currentYear = new Date().getFullYear();
  const lastTwoDigits = currentYear % 100;

  const kkNo = watch("kkNo");
  const kartSahAdSoyad = watch("kartSahAdSoyad");
  const ay = watch("ay");
  const yil = watch("yil");
  const cvc = watch("cvc");

  const maskCardNumber = (value) => {
    let maskedValue = value.replace(/\D/g, "").slice(0, 16);
    maskedValue = maskedValue.padEnd(16, "#");

    return maskedValue
      .split("")
      .map((char, index) => (index % 4 === 3 ? `${char} ` : char))
      .join("")
      .trim();
  };

  const kartSubmit = (data) => {
    setCardInfo(data);
    toast.success("Kart bilgileri kaydedildi");
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setValue("kkNo", value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCreditCard />
        Ödeme Bilgileri
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`
          rounded-lg shadow-md overflow-hidden order-2 md:order-1
          ${theme === "light" ? "bg-white" : "bg-gray-800"}
        `}
        >
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="font-medium">Kart Bilgilerinizi Girin</h2>
          </div>

          <form onSubmit={handleSubmit(kartSubmit)} className="p-6 space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="cardNumber"
                className="text-sm font-medium flex items-center gap-1"
              >
                <FaCreditCard className="text-blue-500" />
                Kart Numarası <span className="text-red-500">*</span>
              </label>
              <input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("kkNo", {
                  required: "Kart numarası zorunludur",
                  pattern: {
                    value: /^(?:\d{4}\s?){4}$/,
                    message: "Geçerli bir kart numarası giriniz",
                  },
                })}
                onChange={handleCardNumberChange}
              />
              {errors.kkNo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.kkNo.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="cardHolder"
                className="text-sm font-medium flex items-center gap-1"
              >
                <FaUser className="text-blue-500" />
                Kart Sahibinin Adı ve Soyadı{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="cardHolder"
                type="text"
                placeholder="Ad Soyad"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("kartSahAdSoyad", {
                  required: "Kart sahibi adı zorunludur",
                  minLength: {
                    value: 6,
                    message: "Ad ve soyad en az 6 karakter olmalıdır",
                  },
                })}
              />
              {errors.kartSahAdSoyad && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.kartSahAdSoyad.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 col-span-1">
                <label
                  htmlFor="ay"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  <FaCalendarAlt className="text-blue-500" />
                  Ay
                </label>
                <select
                  id="ay"
                  {...register("ay", { required: "Zorunlu!" })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ay</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.ay && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ay.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 col-span-1">
                <label htmlFor="yil" className="text-sm font-medium">
                  Yıl
                </label>
                <select
                  id="yil"
                  {...register("yil", { required: "Zorunlu!" })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Yıl</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={lastTwoDigits + i}>
                      {lastTwoDigits + i}
                    </option>
                  ))}
                </select>
                {errors.yil && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.yil.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 col-span-1">
                <label
                  htmlFor="cvc"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  <FaLock className="text-blue-500" />
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  maxLength={3}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onFocus={() => setCvcActive(true)}
                  // onBlur olayını doğrudan React Hook Form ile entegre edelim
                  {...register("cvc", {
                    required: "CVC zorunludur",
                    validate: {
                      length: (value) =>
                        value.length === 3 || "CVC 3 haneli olmalıdır",
                    },
                    onBlur: () => {
                      // setTimeout kullanarak event queue'nun sonuna atalım
                      setTimeout(() => setCvcActive(false), 100);
                    },
                  })}
                  // Input değerini sadece rakam olarak sınırlayalım
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 3);
                  }}
                />
                {errors.cvc && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cvc.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium mt-4"
            >
              Ödeme Bilgilerini Kaydet
            </button>
          </form>
        </div>

        <div className="order-1 md:order-2">
          <div
            className={`
            w-full h-56 rounded-xl shadow-lg overflow-hidden perspective-1000 transition-all duration-500
            ${cvcActive ? "rotate-y-180" : ""}
            ${
              theme === "light"
                ? "bg-gradient-to-r from-blue-500 to-purple-600"
                : "bg-gradient-to-r from-blue-800 to-purple-900"
            }
          `}
          >
            <div
              className={`
              relative w-full h-full transition-all duration-500 transform-style-3d
              ${cvcActive ? "rotate-y-180" : ""}
            `}
            >
              {/* Front of card */}
              <div
                className={`
                absolute w-full h-full backface-hidden p-6 flex flex-col justify-between
                ${cvcActive ? "opacity-0" : "opacity-100"}
              `}
              >
                <div className="flex justify-between items-center">
                  <img
                    src={chipImage || "/placeholder.svg"}
                    width={50}
                    alt="Chip"
                    className="object-contain"
                  />
                  <RiVisaLine size={60} className="text-white" />
                </div>

                <div className="text-white text-xl tracking-widest font-medium">
                  {kkNo || "•••• •••• •••• ••••"}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-blue-100 mb-1">Kart Sahibi</p>
                    <p className="text-white font-medium uppercase tracking-wider">
                      {kartSahAdSoyad || "AD SOYAD"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-blue-100 mb-1">Son Kullanma</p>
                    <p className="text-white">
                      {ay ? ay : "MM"}/{yil ? yil : "YY"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Back of card */}
              <div
                className={`
                absolute w-full h-full backface-hidden rotate-y-180
                ${cvcActive ? "opacity-100" : "opacity-0"}
              `}
              >
                <div className="w-full h-12 bg-black mt-6"></div>

                <div className="px-6 mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <RiVisaLine size={40} className="text-white" />
                    <p className="text-white text-sm">Güvenlik Kodu</p>
                  </div>

                  <div className="bg-white text-black h-10 rounded flex items-center justify-end pr-4">
                    <p className="font-mono">{cvc || "•••"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Kart bilgileriniz güvenli bir şekilde saklanır.</p>
            <p>CVC kodunu görmek için CVC alanına tıklayın.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
