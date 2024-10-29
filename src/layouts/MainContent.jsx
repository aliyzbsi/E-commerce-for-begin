import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";

import Basket from "../components/Basket";
import ProductItem from "../components/ProductItem";
import AdresForm from "../components/AdresForm";
import PaymentInfo from "../components/PaymentInfo";
import { useTheme } from "../context/ThemeContext";

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
                }
              />
              <Route
                path="/sepet/odeme"
                element={
                  <PaymentInfo
                    sepet={sepet}
                    setSepet={setSepet}
                    cardInfo={cardInfo}
                    setCardInfo={setCardInfo}
                  />
                }
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
