import { IoBagHandleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";

function Header({ loggedUser, setLoggedUser, sepet, setSepet }) {
  const navigate = useNavigate();

  const handleLogOut = () => {
    setLoggedUser(null);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between border-b-4 border-black p-4 md:p-8 mb-4">
      <h1 className="font-bold text-xl text-center md:text-left">
        WORKINTECH COMMERCE
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-4 mt-2 md:mt-0">
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
              onClick={() => navigate("/sepet")}
              className="relative inline-block transform transition duration-300 hover:scale-125"
            >
              <IoBagHandleOutline size={35} />

              {sepet.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {sepet.length}
                </span>
              )}
            </div>
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
