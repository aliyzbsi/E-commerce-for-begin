import { IoBagHandleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState } from "react";

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

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between border-b-4 border-black p-4 md:p-8 mb-4 relative">
      <h1 className="font-bold text-xl text-center md:text-left">
        WORKINTECH COMMERCE
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-4 mt-2 md:mt-0">
        <ThemeToggleButton />
        <button
          onClick={() => navigate("/")}
          className="px-4 py-1 rounded-full border-2 border-black font-bold hover:bg-blue-400 hover:text-white hover:border-none"
        >
          HOME
        </button>

        {loggedUser ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogOut}
              className="px-4 py-1 rounded-full border-2 border-black font-bold hover:bg-blue-400 hover:text-white hover:border-none"
            >
              LOGOUT
            </button>
            <p className="text-center border-2 border-black rounded-2xl px-2 flex items-center gap-2">
              <FaRegUserCircle size={20} />
              {loggedUser}
            </p>
            <div
              onClick={() => setIsCartOpen((prev) => !prev)}
              className="relative inline-block transform transition duration-300 hover:scale-125 cursor-pointer"
            >
              <IoBagHandleOutline size={35} />
              {sepet?.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {sepet.length}
                </span>
              )}
            </div>
            {isCartOpen && (
              <div className="absolute right-4 top-44 md:top-16 md:w-64 mt-3 w-full bg-white border border-gray-300 shadow-lg p-4 rounded-lg z-10">
                <h3 className="font-bold mb-2">Sepetiniz</h3>
                {sepet?.length ? (
                  sepet.map((item, index) => (
                    <div key={index} className="mb-2 border-2 p-2">
                      <div className="flex gap-2 items-center ">
                        <img src={item.image} width={50} alt="" />
                        <p className="text-">{item.title}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2 p-2">
                        <p className="text-sm font-bold text-gray-600">
                          {(item.price * item.adet).toFixed(2)} ₺
                        </p>
                        <button
                          onClick={() => urunCikar(item.id)}
                          className="flex-shrink-0 transform transition duration-300 hover:scale-125"
                        >
                          <RiDeleteBinLine size={25} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Sepetiniz boş</p>
                )}
                <button
                  onClick={() => {
                    navigate("/sepet");
                    setIsCartOpen(false);
                  }}
                  className="mt-2 w-full py-1 bg-blue-400 text-white font-bold rounded-lg"
                >
                  Sepete Git
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-1 rounded-full border-2 border-black font-bold hover:bg-blue-400 hover:text-white hover:border-none"
          >
            LOGIN
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
