import React from "react";
import { useForm } from "react-hook-form";

function PaymentInfo() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      kkNo: "",
      kartSahAdSoyad: "",
      ay: "",
      yil: "",
      cvc: "",
    },
    mode: "onChange",
  });
  // "kkNo" alanını izleyerek anlık değerini alıyoruz
  const kkNo = watch("kkNo");

  // Kart numarasını maskeleyen fonksiyon
  const maskCardNumber = (value) => {
    let maskedValue = value.replace(/\D/g, "").slice(0, 16); // Sadece rakamları al, ilk 16 haneye sınırla
    maskedValue = maskedValue.padEnd(16, "#"); // 16 haneye kadar tamamla

    return maskedValue
      .split("")
      .map((char, index) => (index % 4 === 3 ? `${char} ` : char))
      .join("")
      .trim();
  };

  const kartSubmit = (data) => {
    console.log(data);
  };

  // `kkNo` alanını izlemek için watch kullanılıyor

  return (
    <div>
      <form onSubmit={handleSubmit(kartSubmit)} className="border-2">
        <div className="flex flex-col">
          <label htmlFor="">
            Kredi Kartı Numarası <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Kart Numarası"
            maxLength="16"
            className="border-2 border-black rounded-lg px-4 py-2"
            {...register("kkNo")}
          />
        </div>
      </form>
      <div className="border-2 p-4 w-80 h-48 rounded-xl mt-10">
        <div>
          {/* Maskeli numarayı anlık olarak izleyip gösteriyoruz */}
          <p>{maskCardNumber(kkNo)}</p>
        </div>
        <div>
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
