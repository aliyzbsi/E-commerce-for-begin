import { useForm } from "react-hook-form";
import chipImage from "../assets/chip.png";
import { RiVisaLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  return (
    <div className="flex flex-col   items-center md:flex-row gap-4">
      <form onSubmit={handleSubmit(kartSubmit)} className="w-full md:w-1/2 p-4">
        <div className="flex flex-col  w-96">
          <label htmlFor="cardNumber">
            Kredi Kartı Numarası <span className="text-red-500">*</span>
          </label>
          <input
            id="cardNumber"
            type="text"
            placeholder="Kart Numarası"
            className="border-2 border-black rounded-lg px-4 py-2"
            {...register("kkNo", {
              required: "Kart numarası zorunludur",
              pattern: {
                value: /^(?:\d{4}\s?){4}$/, // 4 grup 4 rakam
                message: "Kart numarası sadece rakamlardan oluşmalıdır",
              },
            })}
            onChange={handleCardNumberChange}
          />
          {errors.kkNo && (
            <span className="text-red-500">{errors.kkNo.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2  w-96 mt-2">
          <label htmlFor="cardHolder">
            Kart Sahibinin Adı ve Soyadı <span className="text-red-500">*</span>
          </label>
          <input
            id="cardHolder"
            type="text"
            placeholder="Kart Sahibinin Adı ve Soyadı"
            className="border-2 border-black rounded-lg px-4 py-2 w-full"
            {...register("kartSahAdSoyad", {
              required: "Kart sahibi adı zorunludur",
              minLength: {
                value: 6,
                message: "Ad ve soyad en az 6 karakter olmalıdır",
              },
            })}
          />
          {errors.kartSahAdSoyad && (
            <span className="text-red-500">
              {errors.kartSahAdSoyad.message}
            </span>
          )}
        </div>

        <div className="flex justify-between   items-center gap-2 w-96 mt-2">
          <div>
            <label htmlFor="ay" className="flex flex-col">
              Ay
              <select
                {...register("ay", {
                  required: "Zorunlu !",
                })}
                className="border-2 rounded-xl  px-2 py-4"
              >
                <option value="">Ay-SKT</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="yil" className="flex flex-col">
              Yıl
              <select
                {...register("yil", {
                  required: "Zorunlu !",
                })}
                className="border-2 rounded-xl w-24 px-2 py-4"
              >
                <option value="">Yıl-SKT</option>
                {[...Array(21)].map((_, i) => (
                  <option key={i} value={lastTwoDigits + i}>
                    {lastTwoDigits + i}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="cvc" className="flex flex-col ">
              <p>
                CVC (Güvenlik Kodu) <span className="text-red-500">*</span>
              </p>
              <input
                id="cvc"
                type="text"
                placeholder="CVC"
                maxLength={3}
                minLength={3}
                className="border-2 border-black rounded-lg w-32 px-4 py-2"
                onFocus={() => setCvcActive(true)} // onFocus ile giriş yapıldığında
                onInput={(e) => {
                  // Sadece rakamların kalmasını sağlıyoruz
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
                    setCvcActive(false); // Burada onBlur olayını işleyin
                  },
                })}
              />
              {errors.cvc && (
                <span className="text-red-500">{errors.cvc.message}</span>
              )}
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
        >
          Kontrol Et
        </button>
      </form>

      <div className="border-2 w-full md:w-1/2 h-60 rounded-xl flex flex-col justify-between overflow-hidden">
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
              <div className="flex flex-col  justify-between">
                <div className="w-full mt-10 h-10 bg-black"></div>
                <div className="p-4 flex flex-col items-end gap-2">
                  <p className="font-bold">CVV</p>
                  <div className="p-2 w-full h-10 border-2 border-black rounded-xl">
                    <p className="text-end">{cvc.replace(/./g, "*")}</p>
                  </div>
                  <RiVisaLine size={60} />
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <img src={chipImage} width={35} alt="Chip" />
                  <RiVisaLine size={60} />
                </div>
                <div className="border-2 text-center p-2">
                  <p style={{ letterSpacing: "0.20em" }}>
                    {maskCardNumber(kkNo)}
                  </p>
                </div>
                <div className="flex items-center  gap-4 p-4 justify-between">
                  <div className="flex flex-col  max-w-60 gap-2 mt-2 p-2">
                    <p className="text-sm font-medium">Kart Sahibi</p>
                    <p className="font-bold line-clamp-1">
                      {kartSahAdSoyad || "AD SOYAD"}
                    </p>
                  </div>
                  <div>
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
