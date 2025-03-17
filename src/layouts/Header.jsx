import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggleButton from "../components/ThemeToggleButton";
import {
  FaRegUserCircle,
  FaShoppingCart,
  FaTrashAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaHome,
  FaHeart,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useFavorites } from "../context/FavoritesContext";
import SearchBar from "../components/SearchBar";
import NotificationCenter from "../components/NotificationCenter";

function Header({ loggedUser, setLoggedUser, sepet, setSepet }) {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hesap, setHesap] = useState(0);
  const { theme } = useTheme();
  const { favorites } = useFavorites();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (sepet && sepet.length > 0) {
      const array = sepet.map((item) => item.price * item.adet);
      const toplam = array.reduce((acc, value) => acc + value, 0);
      setHesap(toplam);
    } else {
      setHesap(0);
    }
  }, [sepet]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen, isMobileMenuOpen]);

  const handleLogOut = () => {
    setLoggedUser(null);
    setSepet([]);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const urunCikar = (id) => {
    console.log("Ürün çıkarılıyor:", id);
    const sil = sepet.filter((item) => item.id !== id);
    setSepet(sil);
    toast.success("Ürün sepetten çıkarıldı");
  };

  const navigateTo = (path) => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    navigate(path);
  };

  const CartModal = () => {
    if (!isCartOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center">
        <div
          className={`
            w-full md:w-[480px] h-full md:h-auto md:max-h-[90vh] md:mt-16 md:rounded-lg overflow-hidden
            ${theme === "light" ? "bg-white" : "bg-gray-800"}
          `}
        >
          <div className="sticky top-0 p-4 border-b dark:border-gray-700 flex items-center justify-between bg-blue-600 text-white">
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FaShoppingCart />
              Sepetiniz
            </h3>
            <div className="w-8"></div>
          </div>

          <div className="p-4 border-b dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex justify-between items-center font-medium">
              <span>Toplam Tutar:</span>
              <span className="text-xl text-blue-600 dark:text-blue-400 font-bold">
                {hesap.toFixed(2)} ₺
              </span>
            </div>
          </div>

          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {sepet?.length > 0 ? (
              <div className="p-4 space-y-4">
                {sepet.map((item) => (
                  <div
                    key={item.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border
                      ${
                        theme === "light"
                          ? "border-gray-200"
                          : "border-gray-700"
                      }
                    `}
                  >
                    <img
                      src={
                        (item.images && item.images[0]) ||
                        item.thumbnail ||
                        "/placeholder.svg"
                      }
                      alt={item.title}
                      className="w-16 h-16 object-contain rounded-md bg-white p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.adet} adet x {item.price.toFixed(2)} ₺
                      </p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {(item.price * item.adet).toFixed(2)} ₺
                      </p>
                    </div>
                    <button
                      type="button"
                      className="p-3 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                      onClick={() => urunCikar(item.id)}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FaShoppingCart className="mx-auto text-gray-300 dark:text-gray-600 text-5xl mb-4" />
                <p className="text-xl font-medium mb-2">Sepetiniz boş</p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Sepetinize ürün ekleyerek alışverişe başlayabilirsiniz
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/");
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Alışverişe Başla
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {sepet?.length > 0 && (
            <div className="sticky bottom-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                type="button"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-lg"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/sepet");
                }}
              >
                Sepete Git
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <header
      className={`
      ${
        theme === "light"
          ? "bg-white shadow-md"
          : "bg-gray-800 shadow-gray-700/30"
      } 
      fixed w-full z-40 transition-colors duration-300
    `}
    >
      <div className=" text-center bg-red-600 p-2">
        <p className="font-bold text-white">
          Bu Uygulama Herhangi Bir Ticari Faaliyette Bulunmamaktadır ! Sadece
          Bir UI/UX projesidir!
        </p>
      </div>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1
            onClick={() => navigate("/")}
            className="font-bold text-xl md:text-2xl cursor-pointer transition-transform hover:scale-105"
          >
            DÜKKAN <span className="text-blue-600">COMMERCE</span>
          </h1>

          <div className="hidden md:block flex-grow max-w-xl mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaSearch />
            </button>

            {loggedUser && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              >
                <FaShoppingCart />
                {sepet?.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {sepet.length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggleButton />
            <NotificationCenter />

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaHome />
              <span>Ana Sayfa</span>
            </button>

            <button
              onClick={() => navigate("/favorites")}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors relative"
            >
              <FaHeart className="text-red-500" />
              <span>Favoriler</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>

            {loggedUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Çıkış</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <FaRegUserCircle />
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-sm font-medium truncate max-w-[120px]"
                  >
                    {loggedUser}
                  </button>
                </div>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <FaShoppingCart className="text-xl" />
                  {sepet?.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {sepet.length}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium"
              >
                <FaSignInAlt />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden mt-3">
            <SearchBar />
          </div>
        )}
      </div>

      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={`
            fixed inset-0 top-[61px] bg-white dark:bg-gray-800 z-40 
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="container mx-auto px-4 py-6 h-full overflow-y-auto">
            {loggedUser ? (
              <div className="flex items-center gap-3 p-4 mb-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <FaRegUserCircle className="text-2xl text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-blue-600 dark:text-blue-400">
                    {loggedUser}
                  </p>
                  <button
                    onClick={() => navigateTo("/profile")}
                    className="text-sm text-blue-500 dark:text-blue-300"
                  >
                    Profili Görüntüle
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 mb-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <button
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <FaSignInAlt />
                  <span>Giriş Yap</span>
                </button>
              </div>
            )}

            <nav className="space-y-2">
              <button
                onClick={() => navigateTo("/")}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaHome className="text-xl text-blue-600 dark:text-blue-400" />
                <span className="font-medium">Ana Sayfa</span>
              </button>

              <button
                onClick={() => navigateTo("/favorites")}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              >
                <FaHeart className="text-xl text-red-500" />
                <span className="font-medium">Favoriler</span>
                {favorites.length > 0 && (
                  <span className="ml-auto flex items-center justify-center h-6 w-6 text-xs font-bold text-white bg-red-500 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigateTo("/notifications")}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaBell className="text-xl text-yellow-500" />
                <span className="font-medium">Bildirimler</span>
              </button>

              <div className="flex items-center justify-between p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Tema</span>
                </div>
                <ThemeToggleButton />
              </div>

              {loggedUser && (
                <button
                  onClick={handleLogOut}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span className="font-medium">Çıkış Yap</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      )}

      <CartModal />
    </header>
  );
}

export default Header;
