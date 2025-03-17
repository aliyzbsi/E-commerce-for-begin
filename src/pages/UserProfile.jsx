"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";
import { useLocaleStorage } from "../hooks/useLocaleStorage";

function UserProfile({
  loggedUser,
  setLoggedUser,
  addressInfo,
  setAddressInfo,
  cardInfo,
  setCardInfo,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { favorites } = useFavorites();
  const [orders, setOrders] = useLocaleStorage("orders", []);

  // Kullanıcı bilgileri
  const [userInfo, setUserInfo] = useLocaleStorage("userInfo", {
    name: "",
    surname: "",
    email: loggedUser,
    phone: "",
    birthdate: "",
  });

  // Form state
  const [formData, setFormData] = useState(userInfo);

  // Form değişikliklerini izle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Profil bilgilerini güncelle
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUserInfo(formData);
    toast.success("Profil bilgileriniz güncellendi");
  };

  // Çıkış yap
  const handleLogout = () => {
    setLoggedUser(null);
    navigate("/login");
    toast.info("Başarıyla çıkış yapıldı");
  };

  // Adres sil
  const handleDeleteAddress = (id) => {
    const updatedAddresses = addressInfo.filter((address) => address.id !== id);
    setAddressInfo(updatedAddresses);
    toast.success("Adres silindi");
  };

  // Kart sil
  const handleDeleteCard = () => {
    setCardInfo(null);
    toast.success("Kart bilgileri silindi");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div
            className={`rounded-lg shadow-md overflow-hidden ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <div className="p-6 bg-blue-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {userInfo.name
                    ? userInfo.name.charAt(0).toUpperCase()
                    : loggedUser.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-lg">
                    {userInfo.name
                      ? `${userInfo.name} ${userInfo.surname}`
                      : loggedUser}
                  </h2>
                  <p className="text-sm text-blue-100">{loggedUser}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <FaUser />
                  <span>Profilim</span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <FaShoppingBag />
                  <span>Siparişlerim</span>
                  {Array.isArray(orders) && orders.length > 0 && (
                    <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "favorites"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("favorites")}
                >
                  <FaHeart />
                  <span>Favorilerim</span>
                  {favorites.length > 0 && (
                    <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "addresses"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <FaMapMarkerAlt />
                  <span>Adreslerim</span>
                  {addressInfo.filter((a) => a.userId === loggedUser).length >
                    0 && (
                    <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full">
                      {
                        addressInfo.filter((a) => a.userId === loggedUser)
                          .length
                      }
                    </span>
                  )}
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "payment"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab("payment")}
                >
                  <FaCreditCard />
                  <span>Ödeme Yöntemlerim</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Çıkış Yap</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div
            className={`rounded-lg shadow-md overflow-hidden ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            {/* Profile */}
            {activeTab === "profile" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Profil Bilgilerim</h2>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium"
                      >
                        Ad
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="surname"
                        className="block text-sm font-medium"
                      >
                        Soyad
                      </label>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      E-posta adresi değiştirilemez
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium"
                      >
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="birthdate"
                        className="block text-sm font-medium"
                      >
                        Doğum Tarihi
                      </label>
                      <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Bilgilerimi Güncelle
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <div className="p-6 max-h-[80vh] overflow-y-scroll">
                <h2 className="text-2xl  font-bold mb-6">Siparişlerim</h2>

                {Array.isArray(orders) && orders.length > 0 ? (
                  <div className="space-y-6">
                    {/* Siparişleri tersine çevirip en yeniden en eskiye doğru sırala */}
                    {[...orders].reverse().map((order, index) => (
                      <div
                        key={index}
                        className="border dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              Sipariş #{order.timestamp?.toString().slice(-6)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(order.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600 dark:text-blue-400">
                              {order.sepet
                                .reduce(
                                  (total, item) =>
                                    total + item.price * (item.adet || 1),
                                  0
                                )
                                .toFixed(2)}{" "}
                              ₺
                            </p>
                            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Tamamlandı
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="space-y-4">
                            {order.sepet.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4"
                              >
                                <img
                                  src={
                                    item.thumbnail ||
                                    item.images?.[0] ||
                                    "/placeholder.svg"
                                  }
                                  alt={item.title}
                                  className="w-16 h-16 object-contain bg-white p-2 rounded-md"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.adet || 1} adet x{" "}
                                    {item.price.toFixed(2)} ₺
                                  </p>
                                </div>
                                <p className="font-bold whitespace-nowrap">
                                  {(
                                    (item.price || 0) * (item.adet || 1)
                                  ).toFixed(2)}{" "}
                                  ₺
                                </p>
                              </div>
                            ))}
                          </div>

                          {order.selectedAdres && (
                            <div className="mt-4 pt-4 border-t dark:border-gray-700">
                              <p className="font-medium">Teslimat Adresi:</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {order.selectedAdres.adresBasligi} -{" "}
                                {order.selectedAdres.name}{" "}
                                {order.selectedAdres.surname}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {order.selectedAdres.adresInfo},{" "}
                                {order.selectedAdres.town}/
                                {order.selectedAdres.city}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaShoppingBag className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Henüz siparişiniz bulunmuyor
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Siparişleriniz burada görüntülenecektir
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Alışverişe Başla
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Favorites */}
            {activeTab === "favorites" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Favorilerim</h2>

                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-16 object-contain bg-white p-2 rounded-md"
                          onClick={() => navigate(`/product/${item.id}`)}
                          style={{ cursor: "pointer" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-medium truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => navigate(`/product/${item.id}`)}
                            style={{ cursor: "pointer" }}
                          >
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.category}
                          </p>
                          <p className="font-bold text-blue-600 dark:text-blue-400">
                            {item.price.toFixed(2)} ₺
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaHeart className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Henüz favoriniz bulunmuyor
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Beğendiğiniz ürünleri favorilere ekleyerek daha sonra
                      kolayca bulabilirsiniz
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Alışverişe Başla
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === "addresses" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Adreslerim</h2>

                {addressInfo.filter((a) => a.userId === loggedUser).length >
                0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addressInfo
                      .filter((a) => a.userId === loggedUser)
                      .map((address) => (
                        <div
                          key={address.id}
                          className="border dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">
                              {address.adresBasligi}
                            </h3>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <FaSignOutAlt className="rotate-180" />
                            </button>
                          </div>
                          <p className="text-sm">
                            {address.name} {address.surname}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {address.adresInfo}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {address.town}, {address.city}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaMapMarkerAlt className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Henüz adresiniz bulunmuyor
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Adreslerinizi ekleyerek alışverişlerinizde kolayca
                      kullanabilirsiniz
                    </p>
                    <button
                      onClick={() => navigate("/sepet/adres")}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Adres Ekle
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment Methods */}
            {activeTab === "payment" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Ödeme Yöntemlerim</h2>

                {cardInfo ? (
                  <div className="max-w-md">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg mb-4">
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded"></div>
                        <p className="text-lg font-medium">BANKA KARTI</p>
                      </div>

                      <div className="mb-8">
                        <p className="font-mono text-xl tracking-wider">
                          **** **** **** {cardInfo.kkNo.slice(-4)}
                        </p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs mb-1">KART SAHİBİ</p>
                          <p className="font-medium uppercase">
                            {cardInfo.kartSahAdSoyad}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs mb-1">SON KULLANMA</p>
                          <p className="text-white">
                            {cardInfo.ay}/{cardInfo.yil}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => navigate("/sepet/odeme")}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                      >
                        Kartı Düzenle
                      </button>

                      <button
                        onClick={handleDeleteCard}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                      >
                        Kartı Sil
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaCreditCard className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Henüz kayıtlı kartınız bulunmuyor
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Kart bilgilerinizi ekleyerek alışverişlerinizde kolayca
                      kullanabilirsiniz
                    </p>
                    <button
                      onClick={() => navigate("/sepet/odeme")}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Kart Ekle
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
