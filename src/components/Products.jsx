import { useNavigate } from "react-router-dom";

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

  return (
    <div className="p-4">
      {products.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <li
              key={item.id}
              className="flex flex-col border p-4 border-black rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div
                onClick={() => navigate(`/product/${item.id}`)}
                className="flex flex-col flex-wrap items-center justify-between w-full h-full cursor-pointer"
              >
                <div className="flex flex-col items-center text-center gap-2 border-b-2 border-black w-full pb-2 mb-2">
                  <p className="bg-black rounded-full p-2 text-white w-full">
                    {item.category}
                  </p>
                  <img
                    src={item.image}
                    className="w-full h-32 object-contain "
                    alt={item.title}
                  />
                  <p className="font-semibold">{item.title}</p>
                </div>
                <div className="p-2 flex w-44 md:w-72 lg:w-44  flex-grow">
                  <p className="text-gray-700  line-clamp-3 ">
                    {item.description}
                  </p>
                </div>
                <div className="flex w-full justify-between items-center p-2 mt-4">
                  <p className="font-semibold text-lg">{item.price}₺</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      AddSepet(item);
                    }}
                    className="bg-green-600 p-1 px-3 rounded-full hover:bg-green-400 text-white transition-colors duration-200"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Products;
