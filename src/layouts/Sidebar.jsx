"use client";

import { useQuery } from "@tanstack/react-query";
import { getFilteredProduct, getProduct } from "../services/api";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import SepetSidebar from "../components/SepetSidebar";
import { useTheme } from "../context/ThemeContext";
import { FaFilter, FaSearch, FaTag } from "react-icons/fa";
import { useLocaleStorage } from "../hooks/useLocaleStorage";
import { useState } from "react";
import { Bell, Heart } from "lucide-react";

function Sidebar({
  sepet,
  setSepet,

  selectedAdres,
  setCardInfo,
  cardInfo,
  orderDetails,
  setOrderDetails,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProduct,
  });

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const savedFavorites = localStorage.getItem("favorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    }
    return [];
  });

  const [notification, setNotification] = useState(() => {
    if (typeof window !== "undefined") {
      const userNotifications = localStorage.getItem("notifications");
      return userNotifications ? JSON.parse(userNotifications) : [];
    }
    if (notification === null) {
      setNotification(["Okunmamış Bildiriminiz Yoktur"]);
    }
    return [];
  });

  const renderSidebarContent = () => {
    if (location.pathname === "/") {
      return (
        <div>
          <div className="p-4 font-bold text-lg border-b flex items-center gap-4 text-blue-600">
            <p>BİLDİRİMLERİN</p>
            <Bell />
          </div>
          {notification.map((not) => (
            <div key={not.id}>
              <p>{not}</p>
            </div>
          ))}
          <div className="p-4 font-bold text-lg border-b flex items-center gap-4 text-red-600">
            <p>FAVORİ LİSTEN</p>
            <Heart />
          </div>
          {favorites.map((favorite) => (
            <div key={favorite.id} className="flex items-center">
              <img src={favorite.images[0]} className="w-20 h-20" alt="" />
              <p>{favorite.title}</p>
            </div>
          ))}
        </div>
      );
    }

    if (
      location.pathname === "/sepet" ||
      location.pathname === "/sepet/odeme" ||
      location.pathname === "/sepet/adres"
    ) {
      return (
        <SepetSidebar
          sepet={sepet}
          selectedAdres={selectedAdres}
          cardInfo={cardInfo}
          setCardInfo={setCardInfo}
          setSepet={setSepet}
          orderDetails={orderDetails}
          setOrderDetails={setOrderDetails}
        />
      );
    }
  };

  return (
    <aside
      className={`
      w-full md:w-1/3 lg:w-1/4 h-fit sticky top-24
      ${theme === "light" ? "bg-white" : "bg-gray-800"}
      rounded-xl shadow-md overflow-hidden transition-colors duration-300
    `}
    >
      {renderSidebarContent()}
    </aside>
  );
}

export default Sidebar;
