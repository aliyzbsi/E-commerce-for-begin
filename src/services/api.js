import axios from "axios";

// DummyJSON API temel URL'si
const API_BASE_URL = "https://dummyjson.com";

// Tüm ürünleri getir
export const getProduct = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products?limit=200`);
    if (!response.data || !Array.isArray(response.data.products)) {
      console.error("Invalid response format from API:", response.data);
      return [];
    }
    return response.data.products;
  } catch (error) {
    console.error("Ürünler yüklenirken hata oluştu:", error);
    return [];
  }
};

// Belirli bir ürünü ID'ye göre getir
export const getSelectedProduct = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    if (!response.data || typeof response.data !== "object") {
      console.error("Invalid product data from API:", response.data);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error(`ID: ${id} olan ürün yüklenirken hata oluştu:`, error);
    return null;
  }
};

// Tüm kategorileri getir
export const getFilteredProduct = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/categories`);
    return response.data || [];
  } catch (error) {
    console.error("Kategoriler yüklenirken hata oluştu:", error);
    return [];
  }
};

// Belirli bir kategorideki ürünleri getir
export const getProductsByCategory = async (category) => {
  try {
    // "Tüm Ürünler" seçildiğinde tüm ürünleri getir
    if (category === "Tüm Ürünler") {
      return getProduct();
    }

    // API'ye gönderilecek kategori adını düzenle
    // Örneğin "Home Decoration" -> "home-decoration" formatına çevir
    const formattedCategory = category.toLowerCase().replace(/\s+/g, "-");
    console.log("formatlanmışmı", formattedCategory);
    const response = await axios.get(
      `${API_BASE_URL}/products/category/${formattedCategory}`
    );

    if (!response.data || !Array.isArray(response.data.products)) {
      console.error("Invalid response format from API:", response.data);
      return [];
    }

    return response.data.products;
  } catch (error) {
    console.error(
      `${category} kategorisindeki ürünler yüklenirken hata oluştu:`,
      error
    );
    // Hata durumunda boş dizi döndür
    return [];
  }
};

// Ürün arama
export const searchProducts = async (query) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/search?q=${query}`
    );
    return response.data.products || [];
  } catch (error) {
    console.error(`"${query}" araması yapılırken hata oluştu:`, error);
    return [];
  }
};

// Belirli bir ürünü getir
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ürün ID: ${id} getirilirken hata oluştu:`, error);
    throw new Error(
      "Ürün detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    );
  }
};
