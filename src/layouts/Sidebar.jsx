import { useQuery } from "@tanstack/react-query";
import { getFilteredProduct, getProduct } from "../services/apiService";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import SepetSidebar from "../components/SepetSidebar";
import { useTheme } from "../context/ThemeContext";

function Sidebar({ loggedUser, sepet, sideBarFilter, setSideBarFilter }) {
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
    <div className="border-2 border-black rounded-xl p-4 flex flex-col w-full md:w-1/3 gap-4">
      <h1 className="font-bold text-lg">ÜRÜNLER</h1>
      {loggedUser ? (
        location.pathname === "/" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading products</p>}
            {product.length > 0 && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col p-2 gap-2">
                  <label
                    className="font-semibold border-b-2 text-center border-black"
                    htmlFor="productName"
                  >
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    id="productName"
                    className={
                      theme === "light"
                        ? "border-2 w-full border-black rounded-full p-2"
                        : "border-2 w-full border-black rounded-full p-2 text-black"
                    }
                    placeholder="Ürün adı"
                    {...register("productName")}
                  />
                </div>
                <div className="flex flex-col  gap-2">
                  <label
                    htmlFor="minPrice"
                    className="font-semibold border-b-2 text-center border-black"
                  >
                    Fiyat Aralığı
                  </label>
                  <div className="flex flex-col md:flex-col lg:flex-row  items-center w-full  justify-between">
                    <input
                      type="number"
                      id="minPrice"
                      placeholder="min"
                      className="border-2 p-2 rounded-full border-black"
                      {...register("minPrice")}
                    />
                    <span className="font-bold text-xl">-</span>
                    <input
                      type="number"
                      placeholder="max"
                      className="border-2 p-2 rounded-full border-black"
                      {...register("maxPrice")}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 uppercase p-2">
                  {categories.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <input
                        type="checkbox"
                        id={`kategori-${index}`}
                        value={item}
                        {...register("categories")}
                      />
                      <label htmlFor={`kategori-${index}`}>{item}</label>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white rounded p-2"
                >
                  Filtrele
                </button>
                {sideBarFilter.length === 0 && (
                  <p className="text-red-500 font-semibold">
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
            <SepetSidebar sepet={sepet} />
          </div>
        ) : (
          <div>hangi sayfaysa artık</div>
        )
      ) : (
        <p>Ürünleri Görmek için Giriş Yapınız</p>
      )}
    </div>
  );
}

export default Sidebar;
