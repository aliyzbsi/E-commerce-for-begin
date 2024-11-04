import { IoBagHandleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Header({ loggedUser, setLoggedUser, sepet, setSepet }) {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogOut = () => {
    setLoggedUser(null);
    setSepet(null);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const urunCikar = (id) => {
    const sil = sepet.filter((item) => item.id !== id);
    setSepet(sil);
  };
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } w-full flex flex-col md:flex-row flex-wrap items-center justify-center md:justify-between border-b-4 border-black p-4 md:p-6 lg:p-8 mb-4 fixed z-40 `}
    >
      <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-center md:text-left">
        WORKINTECH COMMERCE
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-4 mt-2 md:mt-0">
        <ThemeToggleButton />

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-full border-2 border-black font-bold transition-colors duration-200 hover:bg-blue-500 hover:text-white"
        >
          HOME
        </button>

        {loggedUser ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogOut}
              className="px-4 py-2 rounded-full border-2 border-black font-bold transition-colors duration-200 hover:bg-blue-500 hover:text-white"
            >
              LOGOUT
            </button>

            <p className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-black">
              <FaRegUserCircle size={20} />
              <span className="font-semibold text-sm">{loggedUser}</span>
            </p>

            <div
              onClick={() => setIsCartOpen((prev) => !prev)}
              className="relative cursor-pointer transform transition-transform duration-300 hover:scale-110"
            >
              <IoBagHandleOutline size={30} />
              {sepet?.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {sepet.length}
                </span>
              )}
            </div>

            {isCartOpen && (
              <div
                className={`${
                  theme === "light"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                } absolute right-0 top-16 mt-36 md:mt-12 w-72 md:w-80  border border-gray-300 shadow-lg p-4 rounded-lg z-20 `}
              >
                <h3 className="font-bold mb-2">Sepetiniz</h3>
                {sepet?.length ? (
                  sepet.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 mb-2 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 rounded-md"
                      />
                      <p className="flex-grow mx-2 text-sm font-semibold">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold ">
                          {(item.price * item.adet).toFixed(2)} ₺
                        </p>
                        <button
                          onClick={() => urunCikar(item.id)}
                          className="text-red-600 transform transition-transform duration-300 hover:scale-125"
                        >
                          <RiDeleteBinLine size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Sepetiniz boş</p>
                )}
                <button
                  onClick={() => {
                    navigate("/sepet");
                    setIsCartOpen(false);
                  }}
                  className="mt-2 w-full py-2 bg-blue-500 text-white font-bold rounded-lg transition-colors duration-200 hover:bg-blue-600"
                >
                  Sepete Git
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-full border-2 border-black font-bold transition-colors duration-200 hover:bg-blue-500 hover:text-white"
          >
            LOGIN
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
