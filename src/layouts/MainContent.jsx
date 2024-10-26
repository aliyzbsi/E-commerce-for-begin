import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";

import Basket from "../components/Basket";
import ProductItem from "../components/ProductItem";
import { useQuery } from "@tanstack/react-query";
import { getFilteredProduct } from "../services/apiService";

function MainContent({
  loggedUser,
  sideBarFilter,
  setLoggedUser,
  sepet,
  setSepet,
}) {
  return (
    <div className="flex flex-col flex-wrap w-full p-4  border-2 border-black rounded-2xl">
      <div>
        <Routes>
          {loggedUser ? (
            <>
              <Route
                path="/"
                element={
                  <Home
                    sepet={sepet}
                    setSepet={setSepet}
                    sideBarFilter={sideBarFilter}
                  />
                }
              />
              <Route
                path="/sepet"
                element={<Basket sepet={sepet} setSepet={setSepet} />}
              />
              <Route
                path="/product/:id"
                element={<ProductItem sepet={sepet} setSepet={setSepet} />}
              />
            </>
          ) : (
            <Route
              path="/login"
              element={
                <Login loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
              }
            />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default MainContent;
