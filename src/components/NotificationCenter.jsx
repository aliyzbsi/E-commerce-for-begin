import { useState } from "react";
import {
  useNotifications,
  NOTIFICATION_TYPES,
} from "../context/NotificationContext";
import { FaBell, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationIcon,
  } = useNotifications();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.ORDER:
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case NOTIFICATION_TYPES.FAVORITE:
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case NOTIFICATION_TYPES.DISCOUNT:
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case NOTIFICATION_TYPES.SUCCESS:
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case NOTIFICATION_TYPES.INFO:
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatTimeAgo = (date) => {
    try {
      const now = new Date();
      const pastDate = new Date(date);

      const diffInMinutes = Math.floor((now - pastDate) / (1000 * 60));

      if (diffInMinutes < 1) return "Az önce";
      if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} saat önce`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} gün önce`;

      return format(pastDate, "d MMMM yyyy", { locale: tr });
    } catch (error) {
      return "Bilinmeyen tarih";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium">Bildirimler</h3>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                disabled={notifications.every((n) => n.read)}
              >
                <FaCheck size={12} />
                <span>Tümünü Okundu İşaretle</span>
              </button>
              <button
                onClick={clearAllNotifications}
                className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                disabled={notifications.length === 0}
              >
                <FaTrash size={12} />
                <span>Temizle</span>
              </button>
            </div>
          </div>

          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{notification.title}</h4>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Bildiriminiz bulunmuyor
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
