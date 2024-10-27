import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

function SepetSidebar({ sepet }) {
  const [indirimTutari, setIndirimTutari] = useState(0);
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
  }, [araToplam, indirimTutari, kargoBedeli]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <h1 className="font-bold text-2xl">Sepet Özeti</h1>
        <span className="bg-cyan-100 font-semibold border-2 border-blue-500 p-2 rounded-full text-blue-400">
          {sepet.length} Ürün
        </span>
      </div>
      <div className="flex flex-col gap-4  font-semibold">
        <div className="border-b-2 border-black p-2 flex justify-between">
          <span>Ara Toplam:</span> <span>{araToplam.toFixed(2)}₺</span>
        </div>
        <div className="border-b-2 border-black p-2 flex justify-between">
          <span>İndirim Tutarı:</span> <span>{indirimTutari}₺</span>
        </div>
        <div className="border-b-2 border-black p-2 flex justify-between">
          <span>Kargo bedeli:</span> <span>{kargoBedeli}₺</span>
        </div>

        <form onSubmit={handleSubmit(kodUygula)}>
          <input
            type="text"
            placeholder="Hediye çeki kodunuz varsa giriniz"
            {...register("hediyeKodu", {
              validate: (value) => {
                return hediyeCeki[value] || "Geçersiz hediye çeki kodu";
              },
            })}
            className="border-2 border-black p-2 w-full mt-4"
          />
          {errors.hediyeKodu && (
            <p className="text-red-500">{errors.hediyeKodu.message}</p>
          )}
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white rounded p-2 w-full"
          >
            Kodu uygula
          </button>
        </form>
        <div className="border-b-2 border-black p-2 flex justify-between font-bold">
          <span>Toplam:</span> <span>{toplamTutar.toFixed(2)}₺</span>
        </div>
        {location.pathname === "/sepet" ? (
          <div>
            <button
              onClick={() => navigate("/sepet/adres")}
              className="mt-2 bg-blue-600 text-white rounded p-2 w-full"
            >
              Ürünleri Kontrol Ettim
            </button>
          </div>
        ) : location.pathname === "/sepet/adres" ? (
          <div>
            <button
              onClick={() => navigate("/sepet/odeme")}
              className="mt-2 bg-blue-600 text-white rounded p-2 w-full"
            >
              Ödemeye Geç
            </button>
            <div>
              <p>adres bilgiler</p>
            </div>
          </div>
        ) : location.pathname === "/sepet/odeme" ? (
          <div>
            <button
              onClick={() => navigate("/")}
              className="mt-2 bg-blue-600 text-white rounded p-2 w-full"
            >
              Ödemeye Yap
            </button>
            <div>
              <p>adres bilgileri</p>
            </div>
          </div>
        ) : (
          <div>
            <p>adres bilgileri</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SepetSidebar;
