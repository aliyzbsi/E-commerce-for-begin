import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";

import Basket from "../components/Basket";
import ProductItem from "../components/ProductItem";
import AdresForm from "../components/AdresForm";
import PaymentInfo from "../components/PaymentInfo";
import { useTheme } from "../context/ThemeContext";
import OrderFailed from "../components/OrderFailed";
import SuccessOrder from "../components/SuccessOrder";

function MainContent({
  loggedUser,
  sideBarFilter,
  setLoggedUser,
  sepet,
  setSepet,
  adresInfo,
  setAdresInfo,
  selectedAdres,
  setSelectedAdres,
  cardInfo,
  setCardInfo,
  orderDetails,
  setOrderDetails,
}) {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      } flex flex-col w-full p-4 border-2 border-black rounded-2xl shadow-lg `}
    >
      <div className="w-full max-w-screen-xl mx-auto">
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
                    loggedUser={loggedUser}
                  />
                }
              />

              <Route
                path="/sepet"
                element={
                  <Basket
                    sepet={sepet}
                    loggedUser={loggedUser}
                    setSepet={setSepet}
                  />
                }
              />

              <Route
                path="/sepet/adres"
                element={
                  sepet.length > 0 ? (
                    <AdresForm
                      sepet={sepet}
                      setSepet={setSepet}
                      adresInfo={adresInfo}
                      setAdresInfo={setAdresInfo}
                      setLoggedUser={setLoggedUser}
                      loggedUser={loggedUser}
                      selectedAdres={selectedAdres}
                      setSelectedAdres={setSelectedAdres}
                    />
                  ) : (
                    <Navigate to="/sepet" replace />
                  )
                }
              />

              <Route
                path="/sepet/odeme"
                element={
                  selectedAdres ? (
                    <PaymentInfo
                      cardInfo={cardInfo}
                      setCardInfo={setCardInfo}
                    />
                  ) : (
                    <Navigate to="/sepet/adres" replace />
                  )
                }
              />

              <Route
                path="/product/:id"
                element={<ProductItem sepet={sepet} setSepet={setSepet} />}
              />

              <Route
                path="/order-success"
                element={<SuccessOrder orderDetails={orderDetails} />}
              />
              <Route path="/failed-order" element={<OrderFailed />} />
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
