import { RiDeleteBinLine } from "react-icons/ri";
import { BsBasket } from "react-icons/bs";

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

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl flex gap-2 items-center">
        <BsBasket size={25} />
        Sepet ({sepet.length})
      </h1>
      <ul className="flex flex-col gap-4 py-4">
        {sepet.map((item) => (
          <li key={item.id}>
            <div className="flex flex-col sm:flex-row justify-between p-4 border-2 border-black rounded-lg">
              <div className="flex items-center gap-4 w-full sm:w-96">
                <img
                  src={item.image}
                  className="w-10 h-10 object-cover"
                  alt={item.title}
                />
                <p className="flex-1">{item.title}</p>
              </div>
              <div className="flex items-center gap-4 w-full  sm:w-auto justify-between  p-2 rounded-lg">
                <div className="flex  items-center gap-2">
                  <button
                    onClick={() => urunBirak(item.id)}
                    className="bg-yellow-500 p-2 w-10 rounded-full font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold border-2 p-2 px-4 rounded-full border-black">
                    {item.adet}
                  </span>
                  <button
                    onClick={() => urunEkle(item.id)}
                    className="bg-yellow-500 p-2 w-10 rounded-full font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="hidden sm:block">
                  {(item.price * item.adet).toFixed(2)}₺
                </p>
                <button
                  onClick={() => urunCikar(item.id)}
                  className="flex-shrink-0"
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
