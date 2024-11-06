import { useQuery } from "@tanstack/react-query";
import { getFilteredProduct, getProduct } from "../services/apiService";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import SepetSidebar from "../components/SepetSidebar";
import { useTheme } from "../context/ThemeContext";

function Sidebar({
  loggedUser,
  sepet,
  setSepet,
  sideBarFilter,
  setSideBarFilter,
  selectedAdres,
  setCardInfo,
  cardInfo,
  orderDetails,
  setOrderDetails,
}) {
  const location = useLocation();
  const {
    data: product = [],
    isLoading,
    error,
  } = useQuery({ queryKey: ["products"], queryFn: getProduct });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getFilteredProduct,
  });

  const { register, handleSubmit } = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const { theme } = useTheme();

  const onSubmit = (data) => {
    const filtered = product.filter((item) => {
      const matchName = data.productName
        ? item.title.toLowerCase().includes(data.productName.toLowerCase())
        : true;
      const minPrice = data.minPrice
        ? item.price >= parseFloat(data.minPrice)
        : true;
      const maxPrice = data.maxPrice
        ? item.price <= parseFloat(data.maxPrice)
        : true;
      const matchCategory =
        data.categories?.length > 0
          ? data.categories.includes(item.category)
          : true;

      return matchName && minPrice && maxPrice && matchCategory;
    });

    setSideBarFilter(filtered);
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } border-2 border-gray-300 rounded-xl p-6 flex flex-col w-full md:w-2/5 lg:w-1/3 gap-6  shadow-lg`}
    >
      <h1 className="font-bold text-xl">ÜRÜNLER</h1>
      {loggedUser ? (
        location.pathname === "/" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading products</p>}
            {product.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    className="font-semibold border-b-2 text-center border-gray-300 pb-1"
                    htmlFor="productName"
                  >
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    id="productName"
                    className={`border-2 border-gray-300 text-black w-full rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Ürün adı"
                    {...register("productName")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="minPrice"
                    className="font-semibold border-b-2 text-center border-gray-300 pb-1"
                  >
                    Fiyat Aralığı
                  </label>
                  <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
                    <input
                      type="number"
                      id="minPrice"
                      placeholder="Min"
                      className="border-2 border-gray-300 w-full text-black rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register("minPrice")}
                    />
                    <span className="font-bold text-xl ">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="border-2 border-gray-300 w-full text-black rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register("maxPrice")}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="font-semibold ">Kategoriler</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3">
                    {categories.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`kategori-${index}`}
                          value={item}
                          className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                          {...register("categories")}
                        />
                        <label htmlFor={`kategori-${index}`}>{item}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold rounded-full p-3 hover:bg-blue-700 transition"
                >
                  Filtrele
                </button>

                {sideBarFilter.length === 0 && (
                  <p className="text-red-500 font-semibold text-center">
                    Aranan kriterde ürün bulunamamıştır.
                  </p>
                )}
              </div>
            )}
          </form>
        ) : location.pathname === "/sepet" ||
          location.pathname === "/sepet/odeme" ||
          location.pathname === "/sepet/adres" ? (
          <div>
            <SepetSidebar
              sepet={sepet}
              selectedAdres={selectedAdres}
              cardInfo={cardInfo}
              setCardInfo={setCardInfo}
              setSepet={setSepet}
              orderDetails={orderDetails}
              setOrderDetails={setOrderDetails}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 border-2 p-2">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading products</p>}
            <p className="border-2 text-center font-semibold">
              Bu ürünleri de görmek isteyebilirsiniz
            </p>
            {product
              .sort(() => 0.5 - Math.random())
              .slice(0, 5)
              .map((item) => (
                <div key={item.id}>
                  <button
                    className="flex items-center border-2 border-x-green-400 p-2 hover:bg-green-400 hover:text-white rounded-3xl w-full justify-between"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img src={item.image} className="w-12 h-12 rounded-full" />
                    <p> {item.title}</p>
                  </button>
                </div>
              ))}
          </div>
        )
      ) : (
        <p className="text-center ">Ürünleri görmek için giriş yapınız.</p>
      )}
    </div>
  );
}

export default Sidebar;
