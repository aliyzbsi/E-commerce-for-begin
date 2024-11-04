import { RiDeleteBinLine } from "react-icons/ri";
import { BsBasket } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";

function Basket({ sepet, setSepet }) {
  const urunBirak = (id) => {
    const yeniSepet = sepet
      .map((urun) =>
        urun.id === id && urun.adet > 0
          ? { ...urun, adet: urun.adet - 1 }
          : urun
      )
      .filter((urun) => urun.adet > 0);

    setSepet(yeniSepet);
  };

  const urunEkle = (id) => {
    const yeniSepet = sepet.map((urun) =>
      urun.id === id ? { ...urun, adet: urun.adet + 1 } : urun
    );
    setSepet(yeniSepet);
  };

  const urunCikar = (id) => {
    const yeniSepet = sepet.filter((item) => item.id !== id);
    setSepet(yeniSepet);
  };

  const { theme } = useTheme();

  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } p-4 max-w-full mx-auto `}
    >
      <h1 className="font-bold text-xl flex gap-2 items-center mb-4">
        <BsBasket size={25} />
        Sepet ({sepet.length})
      </h1>
      <ul className="flex flex-col gap-4 py-4">
        {sepet.map((item) => (
          <li key={item.id}>
            <div className="flex flex-col sm:flex-row justify-between p-4 border border-gray-300 rounded-lg shadow-lg transition duration-200 hover:shadow-xl">
              <div className="flex items-center gap-4 w-full sm:w-96">
                <img
                  src={item.image}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  alt={item.title}
                />
                <p className="flex-1 text-lg font-semibold">{item.title}</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => urunBirak(item.id)}
                    className="bg-yellow-500 text-white p-2 w-10 rounded-full font-bold hover:bg-yellow-600 transition"
                  >
                    -
                  </button>
                  <span className="font-bold border-2 border-gray-300 p-2 px-4 rounded-full text-center">
                    {item.adet}
                  </span>
                  <button
                    onClick={() => urunEkle(item.id)}
                    className="bg-yellow-500 text-white p-2 w-10 rounded-full font-bold hover:bg-yellow-600 transition"
                  >
                    +
                  </button>
                </div>
                <p className="hidden sm:block text-lg font-medium">
                  {(item.price * item.adet).toFixed(2)}₺
                </p>
                <button
                  onClick={() => urunCikar(item.id)}
                  className="flex-shrink-0 text-red-500 hover:text-red-600 transition"
                >
                  <RiDeleteBinLine size={25} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Basket;
