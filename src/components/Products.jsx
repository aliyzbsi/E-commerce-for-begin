import { useNavigate } from "react-router-dom";
import { useLocaleStorage } from "../hooks/useLocaleStorage";
import { useTheme } from "../context/ThemeContext";

function Products({ products, sideBarFilter, sepet, setSepet }) {
  const navigate = useNavigate();

  const AddSepet = (item) => {
    const urunIndex = sepet.findIndex((urun) => urun.id === item.id);
    if (urunIndex !== -1) {
      const yeniSepet = [...sepet];
      yeniSepet[urunIndex].adet += 1;
      setSepet(yeniSepet);
    } else {
      setSepet([...sepet, { ...item, adet: 1 }]);
    }
  };
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } p-4 `}
    >
      {products.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <li
              key={item.id}
              className="flex flex-col border border-gray-200 p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <div
                onClick={() => navigate(`/product/${item.id}`)}
                className="flex flex-col items-center cursor-pointer"
              >
                <p className="bg-black text-white rounded-full px-4 py-1 mb-3 text-center w-full">
                  {item.category}
                </p>

                <img
                  src={item.image}
                  className="w-full h-40 object-contain mb-4"
                  alt={item.title}
                />

                <p className="font-semibold text-center text-gray-800 mb-2">
                  {item.title}
                </p>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {item.description}
              </p>

              <div className="flex justify-between items-center mt-auto">
                <p className="font-semibold text-lg text-black">
                  {item.price}₺
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    AddSepet(item);
                  }}
                  className="bg-green-500 hover:bg-green-400 text-white py-1 px-4 rounded-full transition-colors duration-200"
                >
                  Sepete Ekle
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Products;
