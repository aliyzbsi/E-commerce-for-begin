import { useState, useEffect } from "react";

export const useLocaleStorage = (key, initialValue) => {
  const [data, setData] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      // Eğer storedValue yoksa, initialValue'yu kullan
      if (storedValue) {
        return JSON.parse(storedValue);
      }
      // Eğer storedValue yoksa, initialValue'yu set et ve localStorage'a kaydet
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue; // Varsayılan değeri döndür
    } catch (error) {
      console.error("LocalStorage'dan veri okurken hata oluştu:", error);
      return initialValue; // Hata durumunda varsayılan değeri döndür
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("LocalStorage'a veri kaydederken hata oluştu:", error);
    }
  }, [key, data]); // data değiştiğinde localStorage güncellenecek

  const updateStorage = (value) => {
    setData(value); // state'i güncelle
  };

  return [data, updateStorage];
};
