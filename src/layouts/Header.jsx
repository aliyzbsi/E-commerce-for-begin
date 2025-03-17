"use client";

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
  const cartRef = useRef(null);
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
    // Close cart and mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
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

  // Close mobile menu when window is resized to desktop size
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
    const sil = sepet.filter((item) => item.id !== id);
    setSepet(sil);
  };

  const navigateTo = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`
      ${
        theme === "light"
          ? "bg-white shadow-md"
          : "bg-gray-800 shadow-gray-700/30"
      } 
      fixed w-full z-50 transition-colors duration-300
    `}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1
            onClick={() => navigate("/")}
            className="font-bold text-xl md:text-2xl cursor-pointer transition-transform hover:scale-105"
          >
            DÜKKAN <span className="text-blue-600">COMMERCE</span>
          </h1>

          {/* Desktop Search Bar - Hidden on Mobile */}
          <div className="hidden md:block flex-grow max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaSearch />
            </button>

            {loggedUser && (
              <div className="relative" ref={cartRef}>
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <FaShoppingCart />
                  {sepet?.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {sepet.length}
                    </span>
                  )}
                </button>
                {renderCart()}
              </div>
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

                <div className="relative" ref={cartRef}>
                  <button
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  >
                    <FaShoppingCart className="text-xl" />
                    {sepet?.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {sepet.length}
                      </span>
                    )}
                  </button>
                  {renderCart()}
                </div>
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

        {/* Mobile Search Bar - Only visible when search is open */}
        {isSearchOpen && (
          <div className="md:hidden mt-3">
            <SearchBar />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
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

              <div className="flex items-center gap-3 p-4 rounded-lg">
                <FaBell className="text-xl text-yellow-500" />
                <span className="font-medium">Bildirimler</span>
              </div>

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
    </header>
  );

  function renderCart() {
    return isCartOpen ? (
      <div
        className={`
          absolute right-0 top-full mt-2 w-80 rounded-lg shadow-xl overflow-hidden z-50
          ${
            theme === "light"
              ? "bg-white border border-gray-200"
              : "bg-gray-800 border border-gray-700"
          }
        `}
      >
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaShoppingCart />
            Sepetiniz
          </h3>
          <div className="flex justify-between items-center mt-2 font-medium">
            <span>Toplam Tutar:</span>
            <span className="text-blue-600 dark:text-blue-400">
              {hesap.toFixed(2)} ₺
            </span>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {sepet?.length > 0 ? (
            sepet.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 mb-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <img
                  src={item.images[0] || "/placeholder.svg"}
                  alt={item.title}
                  className="w-12 h-12 object-contain rounded-md bg-white p-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.adet} adet x {item.price.toFixed(2)} ₺
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    {(item.price * item.adet).toFixed(2)} ₺
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      urunCikar(item.id);
                    }}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">Sepetiniz boş</p>
          )}
        </div>

        {sepet?.length > 0 && (
          <div className="p-3 border-t dark:border-gray-700">
            <button
              onClick={() => {
                if (loggedUser) {
                  navigate("/sepet");
                } else {
                  navigate("/login", { state: { from: "/sepet" } });
                  toast.info("Sepeti görüntülemek için giriş yapmalısınız");
                }
                setIsCartOpen(false);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Sepete Git
            </button>
          </div>
        )}
      </div>
    ) : null;
  }
}

export default Header;
