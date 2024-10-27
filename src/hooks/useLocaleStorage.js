import { useState } from "react";

export const useLocaleStorage = (key, initialValue) => {
  const [data, setData] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      // Eğer storedValue varsa, JSON.parse yap
      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error("LocalStorage'dan veri okurken hata oluştu:", error);
      // Eğer hata varsa, varsayılan değeri döndür
    }
    // Eğer storedValue yoksa veya hata varsa, initialValue'yu set et
    localStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  });

  const updateStorage = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setData(value);
    } catch (error) {
      console.error("LocalStorage'a veri kaydederken hata oluştu:", error);
    }
  };

  return [data, updateStorage];
};
