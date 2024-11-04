import { useForm } from "react-hook-form";
import chipImage from "../assets/chip.png";
import { RiVisaLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

function PaymentInfo({ setCardInfo }) {
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
  const [cvcActive, setCvcActive] = useState(false);

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

  useEffect(() => {}, [cvcActive]);

  const kartSubmit = (data) => {
    setCardInfo(data);
    toast.success("başarılı");
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setValue("kkNo", value);
  };
  const { theme } = useTheme();

  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } flex flex-col md:flex-row items-center gap-4 p-4 `}
    >
      <form
        onSubmit={handleSubmit(kartSubmit)}
        className="w-full md:w-1/2 border shadow-lg rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Kredi Kartı Bilgileri</h2>

        <div className="flex flex-col mb-4">
          <label htmlFor="cardNumber" className="text-sm font-medium">
            Kredi Kartı Numarası <span className="text-red-500">*</span>
          </label>
          <input
            id="cardNumber"
            type="text"
            placeholder="Kart Numarası"
            className="border-2 border-gray-300 text-black rounded-lg px-4 py-2 mt-1"
            {...register("kkNo", {
              required: "Kart numarası zorunludur",
              pattern: {
                value: /^(?:\d{4}\s?){4}$/,
                message: "Kart numarası yalnızca rakamlardan oluşmalıdır",
              },
            })}
            onChange={handleCardNumberChange}
          />
          {errors.kkNo && (
            <span className="text-red-500 text-sm">{errors.kkNo.message}</span>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="cardHolder" className="text-sm font-medium">
            Kart Sahibinin Adı ve Soyadı <span className="text-red-500">*</span>
          </label>
          <input
            id="cardHolder"
            type="text"
            placeholder="Kart Sahibinin Adı ve Soyadı"
            className="border-2 border-gray-300 text-black rounded-lg px-4 py-2 mt-1"
            {...register("kartSahAdSoyad", {
              required: "Kart sahibi adı zorunludur",
              minLength: {
                value: 6,
                message: "Ad ve soyad en az 6 karakter olmalıdır",
              },
            })}
          />
          {errors.kartSahAdSoyad && (
            <span className="text-red-500 text-sm">
              {errors.kartSahAdSoyad.message}
            </span>
          )}
        </div>

        <div className="flex justify-around flex-wrap items-center gap-4 mb-4">
          <div className="flex flex-col w-1/3">
            <label htmlFor="ay" className="text-sm font-medium">
              Ay
            </label>
            <select
              {...register("ay", { required: "Zorunlu !" })}
              className="border-2 border-gray-300 rounded-lg text-black px-4 py-2 mt-1"
            >
              <option value="">Ay-SKT</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-1/3">
            <label htmlFor="yil" className="text-sm font-medium">
              Yıl
            </label>
            <select
              {...register("yil", { required: "Zorunlu !" })}
              className="border-2 border-gray-300 text-black rounded-lg px-4 py-2 mt-1"
            >
              <option value="">Yıl-SKT</option>
              {[...Array(21)].map((_, i) => (
                <option key={i} value={lastTwoDigits + i}>
                  {lastTwoDigits + i}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-1/3">
            <label htmlFor="cvc" className="text-sm font-medium">
              CVC (Güvenlik Kodu) <span className="text-red-500">*</span>
            </label>
            <input
              id="cvc"
              type="text"
              placeholder="CVC"
              maxLength={3}
              minLength={3}
              className="border-2 border-gray-300 text-black rounded-lg px-4 py-2 mt-1"
              onFocus={() => setCvcActive(true)}
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 3);
              }}
              {...register("cvc", {
                required: "CVC zorunludur",
                validate: {
                  length: (value) =>
                    value.length === 3 || "CVC 3 haneli olmalıdır",
                },
                onBlur: () => {
                  setCvcActive(false);
                },
              })}
            />
            {errors.cvc && (
              <span className="text-red-500 text-sm">{errors.cvc.message}</span>
            )}
          </div>
        </div>
        <div className=" flex justify-end">
          <button
            type="submit"
            className="bg-blue-600  text-white rounded-lg px-4 py-2 mt-4 hover:bg-blue-700 transition duration-200"
          >
            Kontrol Et
          </button>
        </div>
      </form>

      <div className="border-2 w-full md:w-1/2 h-60  rounded-xl flex flex-col justify-between p-4 overflow-hidden">
        <div
          className={`w-full h-full transition-transform duration-600 ${
            cvcActive ? "animate-flip" : ""
          }`}
        >
          <div
            className={`w-full h-full transition-transform duration-600 ${
              cvcActive ? "" : "animate-flip"
            }`}
          >
            {cvcActive ? (
              <div className="flex flex-col justify-between h-full">
                <div className="w-full h-10 bg-black mb-2"></div>
                <div className="flex flex-col items-end">
                  <p className="font-bold">CVV</p>
                  <div className="p-2 w-full h-10 border-2 border-black rounded-xl">
                    <p className="text-end">{cvc.replace(/./g, "*")}</p>
                  </div>
                  <RiVisaLine size={60} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <img src={chipImage} width={35} alt="Chip" />
                  <RiVisaLine size={60} />
                </div>
                <div className="border-2 text-center p-2 mb-2">
                  <p style={{ letterSpacing: "0.20em" }}>
                    {maskCardNumber(kkNo)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Kart Sahibi</p>
                    <p className="font-bold line-clamp-1">
                      {kartSahAdSoyad || "AD SOYAD"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>Valid Thru</p>
                    {ay && yil ? (
                      <p>
                        {ay}/{yil}
                      </p>
                    ) : ay ? (
                      <p>{ay}/YY</p>
                    ) : yil ? (
                      <p>MM/{yil}</p>
                    ) : (
                      <p>MM/YY</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
