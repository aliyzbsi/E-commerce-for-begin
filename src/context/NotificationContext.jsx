import { createContext, useContext, useState, useEffect } from "react";
import {
  FaShoppingBag,
  FaHeart,
  FaTag,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

// Bildirim türleri
export const NOTIFICATION_TYPES = {
  ORDER: "order",
  FAVORITE: "favorite",
  DISCOUNT: "discount",
  INFO: "info",
  SUCCESS: "success",
};

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // LocalStorage'dan bildirimleri yükle
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(
          parsedNotifications.filter((notification) => !notification.read)
            .length
        );
      } catch (error) {
        console.error("Bildirimler yüklenirken hata oluştu:", error);
      }
    }
  }, []);

  // Bildirimler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Bildirim ekle
  const addNotification = (type, title, message, data = {}) => {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    return newNotification.id;
  };

  // Bildirimi okundu olarak işaretle
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );

    setUnreadCount(0);
  };

  // Bildirimi sil
  const removeNotification = (id) => {
    const notification = notifications.find((n) => n.id === id);

    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );

    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Tüm bildirimleri temizle
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Bildirim ikonunu getir
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.ORDER:
        return <FaShoppingBag />;
      case NOTIFICATION_TYPES.FAVORITE:
        return <FaHeart />;
      case NOTIFICATION_TYPES.DISCOUNT:
        return <FaTag />;
      case NOTIFICATION_TYPES.SUCCESS:
        return <FaCheckCircle />;
      case NOTIFICATION_TYPES.INFO:
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        getNotificationIcon,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
