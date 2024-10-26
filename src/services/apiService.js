import axios from "axios";

export const getProduct = () => {
  return axios.get("https://fakestoreapi.com/products").then((res) => res.data);
};

export const getSelectedProduct = (id) => {
  return axios
    .get(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.data);
};

export const getFilteredProduct = () => {
  return axios
    .get("https://fakestoreapi.com/products/categories")
    .then((res) => res.data);
};
